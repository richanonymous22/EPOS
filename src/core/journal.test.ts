import { describe, it, expect } from 'vitest';
import { Journal, type JournalEntry } from './journal';
import { sha256Hex } from './sha256';

describe('SHA-256', () => {
  it('matches the published test vectors', () => {
    expect(sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(sha256Hex('The quick brown fox jumps over the lazy dog')).toBe(
      'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    );
  });

  it('handles input spanning a block boundary', () => {
    expect(sha256Hex('a'.repeat(56))).toBe(
      'b35439a4ac6f0948b6d6f9e3c6af0f5f590ce20f1bde7090ef7970686ec6738a',
    );
  });
});

describe('the sales journal', () => {
  function seeded(): Journal {
    const j = new Journal('TILL-01');
    j.append('ORDER_OPENED', 'Sam', { orderId: 'O1' });
    j.append('LINE_ADDED', 'Sam', { product: 'Vine Burger', qty: 1, gross: 1750 });
    j.append('LINE_VOIDED', 'Sam', { lineId: 'L1' }, 'quality_issue');
    j.append('PAYMENT_TAKEN', 'Sam', { tender: 'card', amount: 1750 });
    return j;
  }

  it('chains each entry to the one before it', () => {
    const j = seeded();
    const all = j.all();
    expect(all[0]!.prevHash).toBe('0'.repeat(64));
    for (let i = 1; i < all.length; i++) {
      expect(all[i]!.prevHash).toBe(all[i - 1]!.hash);
    }
  });

  it('numbers entries sequentially with no gaps', () => {
    const j = seeded();
    expect(j.all().map((e) => e.seq)).toEqual([1, 2, 3, 4]);
  });

  it('verifies a chain that has not been touched', () => {
    const result = seeded().verify();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.count).toBe(4);
  });

  it('detects an altered amount', () => {
    const entries = [...seeded().all()] as JournalEntry[];
    // Someone edits a payment down after the fact — the classic suppression move.
    entries[3] = { ...entries[3]!, payload: { ...entries[3]!.payload, amount: 100 } };

    const result = Journal.hydrate('TILL-01', entries).verify();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.failedAt).toBe(4);
      expect(result.reason).toMatch(/altered after it was written/);
    }
  });

  it('detects a removed entry', () => {
    const entries = [...seeded().all()] as JournalEntry[];
    entries.splice(1, 1); // delete the sale, keep the payment

    const result = Journal.hydrate('TILL-01', entries).verify();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/Sequence gap/);
  });

  it('detects a re-sequenced entry whose hash no longer chains', () => {
    const entries = [...seeded().all()] as JournalEntry[];
    const swapped = [entries[0]!, entries[2]!, entries[1]!, entries[3]!].map((e, i) => ({
      ...e,
      seq: i + 1,
    }));

    const result = Journal.hydrate('TILL-01', swapped).verify();
    expect(result.ok).toBe(false);
  });

  it('records a reason code on anything that reduces money', () => {
    const voided = seeded().all().find((e) => e.type === 'LINE_VOIDED')!;
    expect(voided.reasonCode).toBe('quality_issue');
  });

  it('hashes independently of property insertion order', () => {
    const a = new Journal('T');
    const b = new Journal('T');
    const at = 1_700_000_000_000;
    const x = a.append('LINE_ADDED', 'Sam', { qty: 1, gross: 500, product: 'Chips' }, undefined, at);
    const y = b.append('LINE_ADDED', 'Sam', { product: 'Chips', gross: 500, qty: 1 }, undefined, at);
    expect(x.hash).toBe(y.hash);
  });

  it('exposes a head hash that changes with every append', () => {
    const j = new Journal('T');
    const h0 = j.head;
    j.append('NO_SALE', 'Sam');
    const h1 = j.head;
    j.append('NO_SALE', 'Sam');
    expect(new Set([h0, h1, j.head]).size).toBe(3);
  });
});
