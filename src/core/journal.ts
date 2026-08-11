import { sha256Hex } from './sha256';

/**
 * The append-only, hash-chained sales journal.
 *
 * Every financially significant action becomes an entry. Entries are never updated
 * and never deleted — a correction is a new, compensating entry. Each entry carries
 * the hash of the one before it, so removing or back-dating anything breaks the chain
 * from that point forward and `verify()` will say exactly where.
 *
 * This is the ESS-resistance described in docs/03-architecture.md §3.3, and the
 * reason there is no `deleteEntry` in this file.
 */

export type JournalEventType =
  | 'ORDER_OPENED'
  | 'LINE_ADDED'
  | 'LINE_QTY_CHANGED'
  | 'LINE_VOIDED'
  | 'LINE_DISCOUNTED'
  | 'ORDER_DISCOUNTED'
  | 'SERVICE_CHARGE_SET'
  | 'ORDER_TYPE_CHANGED'
  | 'ORDER_SENT'
  | 'PAYMENT_TAKEN'
  | 'ORDER_COMPLETED'
  | 'NO_SALE'
  | 'AGE_CHECK';

export interface JournalEntry {
  /** Position in this terminal's chain. Gapless by construction. */
  seq: number;
  terminalId: string;
  at: number;
  type: JournalEventType;
  actor: string;
  /** Required on anything that removes or reduces money. */
  reasonCode?: string;
  payload: Record<string, unknown>;
  prevHash: string;
  hash: string;
}

const GENESIS = '0'.repeat(64);

/**
 * Canonical serialisation — keys sorted, so the same logical entry always produces
 * the same hash regardless of property insertion order.
 */
function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonical(obj[k])}`).join(',')}}`;
}

function hashEntry(e: Omit<JournalEntry, 'hash'>): string {
  return sha256Hex(
    canonical({
      seq: e.seq,
      terminalId: e.terminalId,
      at: e.at,
      type: e.type,
      actor: e.actor,
      reasonCode: e.reasonCode ?? null,
      payload: e.payload,
      prevHash: e.prevHash,
    }),
  );
}

export class Journal {
  private entries: JournalEntry[] = [];

  constructor(readonly terminalId: string) {}

  /** The only way to add to the journal. There is deliberately no counterpart. */
  append(
    type: JournalEventType,
    actor: string,
    payload: Record<string, unknown> = {},
    reasonCode?: string,
    at: number = Date.now(),
  ): JournalEntry {
    const prev = this.entries[this.entries.length - 1];
    const partial: Omit<JournalEntry, 'hash'> = {
      seq: (prev?.seq ?? 0) + 1,
      terminalId: this.terminalId,
      at,
      type,
      actor,
      ...(reasonCode ? { reasonCode } : {}),
      payload,
      prevHash: prev?.hash ?? GENESIS,
    };
    const entry: JournalEntry = { ...partial, hash: hashEntry(partial) };
    this.entries.push(entry);
    return entry;
  }

  all(): readonly JournalEntry[] {
    return this.entries;
  }

  get head(): string {
    return this.entries[this.entries.length - 1]?.hash ?? GENESIS;
  }

  get length(): number {
    return this.entries.length;
  }

  /**
   * Re-walk the chain and report the first entry that doesn't verify.
   * This is what produces the evidence pack an HMRC officer would be shown.
   */
  verify(): { ok: true; count: number; head: string } | { ok: false; failedAt: number; reason: string } {
    let prevHash = GENESIS;
    for (let i = 0; i < this.entries.length; i++) {
      const e = this.entries[i]!;
      if (e.seq !== i + 1) {
        return { ok: false, failedAt: e.seq, reason: `Sequence gap: expected ${i + 1}, found ${e.seq}` };
      }
      if (e.prevHash !== prevHash) {
        return { ok: false, failedAt: e.seq, reason: 'Previous-hash mismatch — an earlier entry was altered or removed' };
      }
      const { hash, ...rest } = e;
      if (hashEntry(rest) !== hash) {
        return { ok: false, failedAt: e.seq, reason: 'Entry hash mismatch — this entry was altered after it was written' };
      }
      prevHash = e.hash;
    }
    return { ok: true, count: this.entries.length, head: this.head };
  }

  /** Restore from persisted entries (e.g. after an app restart) without re-hashing. */
  static hydrate(terminalId: string, entries: JournalEntry[]): Journal {
    const j = new Journal(terminalId);
    j.entries = [...entries];
    return j;
  }
}

/** Short display form of a hash for the UI. */
export function shortHash(h: string): string {
  return `${h.slice(0, 8)}…${h.slice(-4)}`;
}

export const VOID_REASON_LABELS: Record<string, string> = {
  customer_changed_mind: 'Customer changed mind',
  ordered_in_error: 'Ordered in error',
  kitchen_unable: 'Kitchen unable to make',
  quality_issue: 'Quality issue',
  manager_comp: 'Manager comp',
};
