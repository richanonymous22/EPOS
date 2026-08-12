import type { OrderType, VatClass } from './types';

/**
 * UK VAT rate resolution.
 *
 * The rate is a function of (product class × order type × date) — never a fixed
 * property of the product. The classic case: a cold sandwich is zero-rated to take
 * away and standard-rated eaten in. Hardcoding a rate per product is the single most
 * common tax bug in EPOS software, and it under-declares VAT, which is the expensive
 * direction to be wrong in.
 *
 * Rates are effective-dated so that a report re-run for a past period uses the rates
 * that applied *then*, not the rates that apply now.
 */

export interface VatRateBand {
  /** Inclusive start of the period this rate applied from (epoch ms). */
  from: number;
  standard: number;
  reduced: number;
  zero: number;
}

/**
 * Historical UK rate bands, newest last. Extend this rather than editing values —
 * changing a past band silently rewrites history in every historical report.
 */
export const VAT_RATE_HISTORY: VatRateBand[] = [
  { from: Date.UTC(2011, 0, 4), standard: 20, reduced: 5, zero: 0 },
  // Temporary hospitality reductions (2020–2022) would be modelled here as their own
  // bands when reporting over those periods.
];

export function ratesAt(at: number): VatRateBand {
  let band = VAT_RATE_HISTORY[0]!;
  for (const b of VAT_RATE_HISTORY) if (b.from <= at) band = b;
  return band;
}

/**
 * Resolve the VAT rate for a product class sold in a given way, at a given time.
 * Returns a whole-number percentage (20 means 20%).
 */
export function resolveVatRate(
  vatClass: VatClass,
  orderType: OrderType,
  at: number = Date.now(),
): number {
  const r = ratesAt(at);

  switch (vatClass) {
    // Standard-rated regardless of how it is sold.
    case 'alcohol':
    case 'confectionery':
    case 'hot_food':
    case 'standard':
      return r.standard;

    // Genuinely zero-rated goods.
    case 'zero':
      return r.zero;

    /**
     * Cold food: consumption on the premises is catering and standard-rated.
     * Taken away it is zero-rated. Delivery follows takeaway.
     */
    case 'cold_food':
      return orderType === 'eat_in' ? r.standard : r.zero;
  }
}

/**
 * Split a VAT-inclusive (gross) amount into net and VAT.
 *
 * UK retail prices are quoted gross, so VAT is extracted rather than added. Rounding
 * happens once, on the VAT figure, and net is derived by subtraction — that way
 * net + vat === gross exactly, for every line, with no reconciliation drift.
 */
export function splitGross(gross: number, ratePercent: number): { net: number; vat: number } {
  if (ratePercent === 0) return { net: gross, vat: 0 };
  const divisor = 1 + ratePercent / 100;
  const net = gross / divisor;
  const vat = gross < 0 ? -Math.round(-(gross - net)) : Math.round(gross - net);
  return { net: gross - vat, vat };
}

/** How a VAT band is described on screen and on the receipt. */
export function bandLabel(band: { rate: number; outOfScope?: boolean }): {
  badge: string;
  note: string;
  zero: boolean;
} {
  if (band.outOfScope) return { badge: 'Outside scope', note: 'service charge', zero: false };
  if (band.rate === 0) return { badge: 'Zero-rated', note: 'goods', zero: true };
  return { badge: `VAT ${band.rate}%`, note: 'goods', zero: false };
}

/** Human label for receipts and the VAT summary. */
export function vatClassLabel(vatClass: VatClass, orderType: OrderType): string {
  const rate = resolveVatRate(vatClass, orderType);
  if (vatClass === 'cold_food' && orderType !== 'eat_in') return 'Zero-rated (takeaway)';
  if (vatClass === 'cold_food') return 'Standard (eat in)';
  return rate === 0 ? 'Zero-rated' : `Standard ${rate}%`;
}
