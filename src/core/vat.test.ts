import { describe, it, expect } from 'vitest';
import { resolveVatRate, splitGross } from './vat';
import { pence } from './money';

describe('UK VAT rate resolution', () => {
  it('zero-rates cold food taken away but standard-rates it eaten in', () => {
    expect(resolveVatRate('cold_food', 'takeaway')).toBe(0);
    expect(resolveVatRate('cold_food', 'delivery')).toBe(0);
    expect(resolveVatRate('cold_food', 'eat_in')).toBe(20);
  });

  it('standard-rates hot food however it is sold', () => {
    for (const t of ['eat_in', 'takeaway', 'delivery'] as const) {
      expect(resolveVatRate('hot_food', t)).toBe(20);
    }
  });

  it('standard-rates alcohol and confectionery however they are sold', () => {
    for (const t of ['eat_in', 'takeaway', 'delivery'] as const) {
      expect(resolveVatRate('alcohol', t)).toBe(20);
      expect(resolveVatRate('confectionery', t)).toBe(20);
    }
  });

  it('zero-rates genuinely zero-rated goods on every channel', () => {
    for (const t of ['eat_in', 'takeaway', 'delivery'] as const) {
      expect(resolveVatRate('zero', t)).toBe(0);
    }
  });
});

describe('extracting VAT from a gross price', () => {
  it('never loses a penny: net + vat === gross, for every price up to £100', () => {
    for (let gross = 0; gross <= 10000; gross++) {
      const { net, vat } = splitGross(gross, 20);
      expect(net + vat).toBe(gross);
    }
  });

  it('extracts the expected VAT from familiar amounts', () => {
    expect(splitGross(pence(6.0), 20)).toEqual({ net: 500, vat: 100 });
    expect(splitGross(pence(17.5), 20).vat).toBe(292); // £2.9166… rounds to £2.92
    expect(splitGross(pence(9.99), 20).vat).toBe(167);
  });

  it('returns the whole amount as net at 0%', () => {
    expect(splitGross(pence(6.5), 0)).toEqual({ net: 650, vat: 0 });
  });

  it('is symmetric for refunds', () => {
    const sale = splitGross(pence(17.5), 20);
    const refund = splitGross(pence(-17.5), 20);
    expect(refund.vat).toBe(-sale.vat);
    expect(refund.net).toBe(-sale.net);
  });
});
