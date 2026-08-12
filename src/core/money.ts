/**
 * All money is handled as integer pence. Never floats — a penny of drift per line
 * across a busy service becomes a cash-up variance nobody can explain.
 */
export type Pence = number;

export function pence(pounds: number): Pence {
  return Math.round(pounds * 100);
}

/** Format for UI display. Always two decimals, always £. */
export function formatMoney(p: Pence, opts: { sign?: boolean } = {}): string {
  const neg = p < 0;
  const abs = Math.abs(p);
  const s = `£${(abs / 100).toFixed(2)}`;
  if (neg) return `−${s}`;
  return opts.sign ? `+${s}` : s;
}

/**
 * Banker-free, deterministic half-up rounding on positive and negative values alike.
 * Math.round(-0.5) is 0 in JS, which breaks refund symmetry — this doesn't.
 */
export function roundHalfUp(n: number): number {
  return n < 0 ? -Math.round(-n) : Math.round(n);
}

/**
 * Apply a percentage to a pence amount, rounded to the nearest penny.
 * `percent` is expressed as a whole number (12.5 means 12.5%).
 */
export function applyPercent(amount: Pence, percent: number): Pence {
  return roundHalfUp((amount * percent) / 100);
}

/**
 * Split an amount into `n` parts that sum exactly back to the original.
 * Used for even bill splits — the remainder pennies go to the earliest parts,
 * so £10.00 across 3 people is 3.34 / 3.33 / 3.33, not 3.33 × 3 and a lost penny.
 */
export function splitEvenly(amount: Pence, n: number): Pence[] {
  if (n <= 0) throw new Error('splitEvenly: n must be > 0');
  const base = Math.floor(amount / n);
  const remainder = amount - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}
