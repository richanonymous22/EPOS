import { describe, it, expect } from 'vitest';
import { pence, splitEvenly, applyPercent } from './money';
import { products, productById } from './catalogue';
import {
  addLine, allocateProportionally, cashSuggestions, changeQty, computeTotals,
  setOrderType, validateModifiers, voidLine,
} from './order';
import type { Order, Product } from './types';

const sandwich = productById.get('dl1')!;   // cold food  £6.50
const burger = productById.get('m2')!;      // hot food   £17.50
const pint = productById.get('d1')!;        // alcohol    £6.20
const loaf = productById.get('dl5')!;       // zero-rated £4.00

function emptyOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'O1', number: 1, orderType: 'eat_in', lines: [],
    openedAt: 0, staffName: 'Sam', ...overrides,
  };
}

describe('adding lines', () => {
  it('merges an identical unsent line instead of stacking duplicates', () => {
    let o = emptyOrder();
    o = addLine(o, burger).order;
    o = addLine(o, burger).order;
    expect(o.lines).toHaveLength(1);
    expect(o.lines[0]!.qty).toBe(2);
  });

  it('keeps lines separate when the modifiers differ', () => {
    let o = emptyOrder();
    o = addLine(o, burger, [{ groupId: 'burger_extras', optionId: 'bacon', name: 'Bacon', priceDelta: pence(2) }]).order;
    o = addLine(o, burger, []).order;
    expect(o.lines).toHaveLength(2);
  });

  it('prices modifiers into the line', () => {
    let o = emptyOrder();
    o = addLine(o, burger, [
      { groupId: 'burger_extras', optionId: 'bacon', name: 'Bacon', priceDelta: pence(2) },
      { groupId: 'burger_extras', optionId: 'cheese', name: 'Cheese', priceDelta: pence(1.5) },
    ]).order;
    expect(computeTotals(o).total).toBe(pence(21.0));
  });
});

describe('voiding and quantities', () => {
  it('removes an unsent line when its quantity reaches zero', () => {
    let o = emptyOrder();
    o = addLine(o, burger).order;
    o = changeQty(o, o.lines[0]!.id, -1);
    expect(o.lines).toHaveLength(0);
  });

  it('never deletes a voided line — it stays on the order for audit', () => {
    let o = emptyOrder();
    o = addLine(o, burger).order;
    o = voidLine(o, o.lines[0]!.id, 'quality_issue', 'Sam');
    expect(o.lines).toHaveLength(1);
    expect(o.lines[0]!.voided?.reason).toBe('quality_issue');
    expect(computeTotals(o).total).toBe(0);
  });

  it('will not silently remove a line that has already gone to the kitchen', () => {
    let o = emptyOrder();
    o = addLine(o, burger).order;
    o = { ...o, lines: o.lines.map((l) => ({ ...l, sent: true, qty: 1 })) };
    o = changeQty(o, o.lines[0]!.id, -1);
    expect(o.lines).toHaveLength(1); // must be voided with a reason instead
  });
});

describe('order type drives both price and VAT', () => {
  it('zero-rates a cold sandwich taken away and standard-rates it eaten in', () => {
    let o = emptyOrder({ orderType: 'eat_in' });
    o = addLine(o, sandwich).order;

    const eatIn = computeTotals(o);
    expect(eatIn.total).toBe(pence(6.5));
    expect(eatIn.vat).toBe(108); // £6.50 gross at 20% → £1.08

    const takeaway = computeTotals(setOrderType(o, 'takeaway', products));
    expect(takeaway.total).toBe(pence(6.5));
    expect(takeaway.vat).toBe(0);
  });

  it('re-prices to the delivery menu when the channel changes', () => {
    let o = emptyOrder({ orderType: 'eat_in' });
    o = addLine(o, sandwich).order;
    expect(computeTotals(o).total).toBe(pence(6.5));

    o = setOrderType(o, 'delivery', products);
    expect(computeTotals(o).total).toBe(pence(7.8)); // uplifted delivery price
    expect(computeTotals(o).vat).toBe(0);            // still cold food off-premises
  });

  it('leaves alcohol standard-rated on every channel', () => {
    let o = emptyOrder();
    o = addLine(o, pint).order;
    for (const t of ['eat_in', 'takeaway', 'delivery'] as const) {
      expect(computeTotals(setOrderType(o, t, products)).vat).toBe(103);
    }
  });
});

describe('mixed-rate bills', () => {
  it('breaks VAT down by rate and reconciles to the header total', () => {
    let o = emptyOrder({ orderType: 'takeaway' });
    o = addLine(o, sandwich).order; // £6.50 @ 0%
    o = addLine(o, burger).order;   // £17.50 @ 20%
    o = addLine(o, loaf).order;     // £4.00 @ 0%

    const t = computeTotals(o);
    expect(t.total).toBe(pence(28.0));
    expect(t.net + t.vat).toBe(t.total);

    const zero = t.vatByRate.find((r) => r.rate === 0)!;
    const std = t.vatByRate.find((r) => r.rate === 20)!;
    expect(zero.gross).toBe(pence(10.5));
    expect(zero.vat).toBe(0);
    expect(std.gross).toBe(pence(17.5));
    expect(std.vat).toBe(292);
  });
});

describe('discounts', () => {
  it('applies a line discount before extracting VAT', () => {
    let o = emptyOrder();
    o = addLine(o, burger).order;
    o = { ...o, lines: o.lines.map((l) => ({ ...l, discountPercent: 50 })) };
    const t = computeTotals(o);
    expect(t.total).toBe(pence(8.75));
    expect(t.vat).toBe(146);
  });

  it('allocates an order discount across lines so the parts sum exactly', () => {
    let o = emptyOrder({ orderDiscountPercent: 10, orderType: 'takeaway' });
    o = addLine(o, sandwich).order;
    o = addLine(o, burger).order;

    const t = computeTotals(o);
    const allocated = t.lines.reduce((s, l) => s + l.discount, 0);
    expect(allocated).toBe(t.orderDiscount);
    expect(t.lines.reduce((s, l) => s + l.gross, 0)).toBe(t.goodsTotal);
    expect(t.net + t.vat).toBe(t.total);
  });

  it('reduces VAT against the correct rate when discounting a mixed bill', () => {
    let o = emptyOrder({ orderDiscountPercent: 100, orderType: 'takeaway' });
    o = addLine(o, sandwich).order;
    o = addLine(o, burger).order;
    const t = computeTotals(o);
    expect(t.total).toBe(0);
    expect(t.vat).toBe(0);
  });
});

describe('service charge', () => {
  it('is added after VAT and carries none of its own', () => {
    let o = emptyOrder({ serviceChargePercent: 12.5 });
    o = addLine(o, burger).order; // £17.50 @ 20%

    const t = computeTotals(o);
    expect(t.serviceCharge).toBe(pence(2.19)); // 12.5% of £17.50 = £2.1875 → £2.19
    expect(t.total).toBe(pence(19.69));
    expect(t.vat).toBe(292);                   // unchanged by the service charge
    expect(t.net + t.vat).toBe(t.total);
  });
});

describe('invariants across randomly generated baskets', () => {
  const pick = <T,>(arr: T[], i: number): T => arr[i % arr.length]!;

  it('always reconciles: net + vat === total, and rate bands sum to the goods total', () => {
    const types = ['eat_in', 'takeaway', 'delivery'] as const;

    for (let seed = 0; seed < 400; seed++) {
      let o = emptyOrder({
        orderType: pick([...types], seed),
        orderDiscountPercent: seed % 5 === 0 ? (seed % 30) : undefined,
        serviceChargePercent: seed % 3 === 0 ? 12.5 : undefined,
      });

      const n = 1 + (seed % 7);
      for (let i = 0; i < n; i++) {
        const prod: Product = pick(products, seed * 7 + i * 13);
        o = addLine(o, prod, [], 1 + ((seed + i) % 3)).order;
      }
      if (seed % 4 === 0 && o.lines.length > 1) {
        o = voidLine(o, o.lines[0]!.id, 'ordered_in_error', 'Sam');
      }

      const t = computeTotals(o);

      expect(t.net + t.vat).toBe(t.total);
      expect(t.total).toBeGreaterThanOrEqual(0);
      expect(t.lines.reduce((s, l) => s + l.gross, 0)).toBe(t.goodsTotal);
      expect(t.vatByRate.reduce((s, r) => s + r.gross, 0)).toBe(t.total);
      expect(t.vatByRate.reduce((s, r) => s + r.vat, 0)).toBe(t.vat);
      for (const l of t.lines) expect(l.net + l.vat).toBe(l.gross);
    }
  });
});

describe('money helpers', () => {
  it('splits a bill evenly without losing pennies', () => {
    expect(splitEvenly(pence(10), 3)).toEqual([334, 333, 333]);
    expect(splitEvenly(pence(10), 3).reduce((a, b) => a + b, 0)).toBe(pence(10));
    for (let n = 1; n <= 12; n++) {
      expect(splitEvenly(9999, n).reduce((a, b) => a + b, 0)).toBe(9999);
    }
  });

  it('allocates proportionally with the parts summing to the whole', () => {
    expect(allocateProportionally(100, [1, 1, 1]).reduce((a, b) => a + b, 0)).toBe(100);
    expect(allocateProportionally(0, [5, 5])).toEqual([0, 0]);
    expect(allocateProportionally(50, [0, 0])).toEqual([0, 0]);
  });

  it('rounds percentages half-up', () => {
    expect(applyPercent(1750, 12.5)).toBe(219); // 218.75 → 219
  });

  it('offers cash buttons at or above the total', () => {
    const s = cashSuggestions(pence(17.5));
    expect(s[0]).toBe(pence(17.5));
    expect(s.every((v) => v >= pence(17.5))).toBe(true);
  });
});

describe('modifier validation', () => {
  const group = {
    id: 'g', name: 'Cooked how?', min: 1, max: 1,
    options: [{ id: 'a', name: 'A', priceDelta: 0 }, { id: 'b', name: 'B', priceDelta: 0 }],
  };

  it('blocks an add when a required choice is missing', () => {
    expect(validateModifiers([group], []).ok).toBe(false);
  });

  it('blocks an add when too many options are chosen', () => {
    const sel = [
      { groupId: 'g', optionId: 'a', name: 'A', priceDelta: 0 },
      { groupId: 'g', optionId: 'b', name: 'B', priceDelta: 0 },
    ];
    expect(validateModifiers([group], sel).ok).toBe(false);
  });

  it('accepts a valid selection', () => {
    const sel = [{ groupId: 'g', optionId: 'a', name: 'A', priceDelta: 0 }];
    expect(validateModifiers([group], sel).ok).toBe(true);
  });
});
