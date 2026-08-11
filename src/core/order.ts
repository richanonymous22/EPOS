import { applyPercent, roundHalfUp, type Pence } from './money';
import { resolveVatRate, splitGross } from './vat';
import type {
  LineTotals, ModifierGroup, Order, OrderLine, OrderTotals, OrderType, Product,
  SelectedModifier, VoidReason,
} from './types';

let lineSeq = 0;
const newLineId = () => `L${Date.now().toString(36)}${(lineSeq++).toString(36)}`;

/** The price actually charged for a product on a given channel. */
export function priceFor(product: Product, orderType: OrderType): Pence {
  return product.priceByOrderType?.[orderType] ?? product.price;
}

/** Gross unit price including the selected modifiers. */
export function unitWithModifiers(line: OrderLine): Pence {
  return line.unitPrice + line.modifiers.reduce((s, m) => s + m.priceDelta, 0);
}

export function isActive(line: OrderLine): boolean {
  return !line.voided;
}

// ---------------------------------------------------------------------------
// Mutating operations — each returns a NEW order. The reducer in the UI never
// edits an order in place, which keeps the journal and the screen in agreement.
// ---------------------------------------------------------------------------

export function addLine(
  order: Order,
  product: Product,
  modifiers: SelectedModifier[] = [],
  qty = 1,
): { order: Order; line: OrderLine } {
  const unitPrice = priceFor(product, order.orderType);

  // Merge into an existing identical, unsent line rather than stacking duplicates —
  // a till that shows "Chips ×1" four times is a till nobody wants to read.
  const signature = modifierSignature(modifiers);
  const existing = order.lines.find(
    (l) =>
      l.productId === product.id &&
      !l.voided &&
      !l.sent &&
      !l.discountPercent &&
      modifierSignature(l.modifiers) === signature,
  );

  if (existing) {
    const merged: OrderLine = { ...existing, qty: existing.qty + qty };
    return {
      order: { ...order, lines: order.lines.map((l) => (l.id === merged.id ? merged : l)) },
      line: merged,
    };
  }

  const line: OrderLine = {
    id: newLineId(),
    productId: product.id,
    name: product.name,
    qty,
    unitPrice,
    modifiers,
    vatClass: product.vatClass,
    station: product.station ?? 'none',
    addedAt: Date.now(),
  };
  return { order: { ...order, lines: [...order.lines, line] }, line };
}

function modifierSignature(mods: SelectedModifier[]): string {
  return mods.map((m) => m.optionId).sort().join('|');
}

export function changeQty(order: Order, lineId: string, delta: number): Order {
  return {
    ...order,
    lines: order.lines.flatMap((l) => {
      if (l.id !== lineId || l.voided) return [l];
      const qty = l.qty + delta;
      // Reducing an unsent line to zero removes it. A *sent* line must be voided
      // with a reason instead — it has already cost the kitchen money.
      if (qty <= 0) return l.sent ? [l] : [];
      return [{ ...l, qty }];
    }),
  };
}

/**
 * Voiding never deletes. The line stays on the order, flagged, with a reason and an
 * actor. This is the ESS-resistant behaviour described in the architecture notes:
 * there is no code path that removes money from a bill without leaving a trace.
 */
export function voidLine(order: Order, lineId: string, reason: VoidReason, by: string): Order {
  return {
    ...order,
    lines: order.lines.map((l) =>
      l.id === lineId ? { ...l, voided: { reason, at: Date.now(), by } } : l,
    ),
  };
}

export function setLineDiscount(order: Order, lineId: string, percent: number): Order {
  return {
    ...order,
    lines: order.lines.map((l) =>
      l.id === lineId ? { ...l, discountPercent: percent || undefined } : l,
    ),
  };
}

export function markSent(order: Order): Order {
  return { ...order, lines: order.lines.map((l) => (l.voided ? l : { ...l, sent: true })) };
}

/**
 * Changing the order type re-prices the whole bill against the catalogue and
 * re-resolves VAT. This is why a UK till cannot treat "eat in / takeaway" as a
 * label — the same basket is a different amount of money.
 */
export function setOrderType(order: Order, orderType: OrderType, catalogue: Product[]): Order {
  const byId = new Map(catalogue.map((p) => [p.id, p]));
  return {
    ...order,
    orderType,
    lines: order.lines.map((l) => {
      const p = byId.get(l.productId);
      return p ? { ...l, unitPrice: priceFor(p, orderType) } : l;
    }),
  };
}

// ---------------------------------------------------------------------------
// Totals
// ---------------------------------------------------------------------------

/**
 * The whole money model in one function.
 *
 * Order of operations matters and is deliberate:
 *   line gross → line discount → order discount (allocated across lines) →
 *   VAT extracted per line at that line's resolved rate → service charge (no VAT).
 *
 * The order discount is allocated back onto lines using largest-remainder so the
 * parts sum exactly to the discount, and so VAT is reduced against the correct
 * rate. Applying a discount to the total and then guessing the VAT split is how
 * tills end up under- or over-declaring.
 */
export function computeTotals(order: Order, at: number = Date.now()): OrderTotals {
  const active = order.lines.filter(isActive);

  const base = active.map((l) => {
    const grossBeforeDiscount = unitWithModifiers(l) * l.qty;
    const discount = l.discountPercent ? applyPercent(grossBeforeDiscount, l.discountPercent) : 0;
    return { line: l, grossBeforeDiscount, discount, gross: grossBeforeDiscount - discount };
  });

  const subtotal = base.reduce((s, b) => s + b.gross, 0);
  const orderDiscount = order.orderDiscountPercent
    ? applyPercent(subtotal, order.orderDiscountPercent)
    : 0;

  const allocated = allocateProportionally(orderDiscount, base.map((b) => b.gross));

  const lines: LineTotals[] = base.map((b, i) => {
    const gross = b.gross - (allocated[i] ?? 0);
    const vatRate = resolveVatRate(b.line.vatClass, order.orderType, at);
    const { net, vat } = splitGross(gross, vatRate);
    return {
      lineId: b.line.id,
      grossBeforeDiscount: b.grossBeforeDiscount,
      discount: b.discount + (allocated[i] ?? 0),
      gross,
      net,
      vat,
      vatRate,
    };
  });

  const goodsTotal = subtotal - orderDiscount;

  // Discretionary service charge is outside the scope of VAT, so it is added after
  // the VAT calculation and carries no VAT of its own.
  const serviceCharge = order.serviceChargePercent
    ? applyPercent(goodsTotal, order.serviceChargePercent)
    : 0;

  const vat = lines.reduce((s, l) => s + l.vat, 0);
  const total = goodsTotal + serviceCharge;
  const net = total - vat;

  const byRate = new Map<number, { rate: number; net: Pence; vat: Pence; gross: Pence }>();
  for (const l of lines) {
    const e = byRate.get(l.vatRate) ?? { rate: l.vatRate, net: 0, vat: 0, gross: 0 };
    e.net += l.net;
    e.vat += l.vat;
    e.gross += l.gross;
    byRate.set(l.vatRate, e);
  }
  if (serviceCharge > 0) {
    const e = byRate.get(0) ?? { rate: 0, net: 0, vat: 0, gross: 0 };
    e.net += serviceCharge;
    e.gross += serviceCharge;
    byRate.set(0, e);
  }

  return {
    lines,
    subtotal,
    orderDiscount,
    goodsTotal,
    serviceCharge,
    total,
    net,
    vat,
    vatByRate: [...byRate.values()].sort((a, b) => b.rate - a.rate),
    itemCount: active.reduce((s, l) => s + l.qty, 0),
  };
}

/**
 * Distribute `amount` across `weights` in proportion, with the parts summing
 * exactly to `amount`. Remainder pennies go to the largest fractional parts
 * (largest-remainder / Hare quota), which is stable and explainable to an auditor.
 */
export function allocateProportionally(amount: Pence, weights: Pence[]): Pence[] {
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  if (amount === 0 || totalWeight === 0) return weights.map(() => 0);

  const exact = weights.map((w) => (amount * w) / totalWeight);
  const floored = exact.map((e) => Math.floor(e));
  let remainder = amount - floored.reduce((s, f) => s + f, 0);

  const order = exact
    .map((e, i) => ({ i, frac: e - Math.floor(e) }))
    .sort((a, b) => b.frac - a.frac);

  const out = [...floored];
  for (let k = 0; remainder > 0 && k < order.length; k++, remainder--) {
    out[order[k]!.i] = (out[order[k]!.i] ?? 0) + 1;
  }
  return out;
}

/** Validate a modifier selection against its group's min/max before allowing an add. */
export function validateModifiers(
  groups: ModifierGroup[],
  selected: SelectedModifier[],
): { ok: true } | { ok: false; message: string } {
  for (const g of groups) {
    const n = selected.filter((s) => s.groupId === g.id).length;
    if (n < g.min) {
      return { ok: false, message: `Choose ${g.min === 1 ? 'a' : g.min} ${g.name.toLowerCase()}` };
    }
    if (n > g.max) {
      return { ok: false, message: `Choose at most ${g.max} from ${g.name}` };
    }
  }
  return { ok: true };
}

/** Change due, never negative. */
export function changeDue(total: Pence, tendered: Pence): Pence {
  return Math.max(0, tendered - total);
}

/** Suggested "quick cash" buttons: exact, then sensible round-ups above the total. */
export function cashSuggestions(total: Pence): Pence[] {
  if (total <= 0) return [];
  const out = new Set<Pence>([total]);
  for (const step of [500, 1000, 2000]) {
    const up = Math.ceil(total / step) * step;
    if (up !== total) out.add(up);
  }
  out.add(roundHalfUp(Math.ceil(total / 5000) * 5000));
  return [...out].filter((v) => v >= total).sort((a, b) => a - b).slice(0, 4);
}
