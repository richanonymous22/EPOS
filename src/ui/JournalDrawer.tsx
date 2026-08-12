import { useState } from 'react';
import { Journal, shortHash, type JournalEntry } from '../core/journal';
import { formatMoney } from '../core/money';

interface Props {
  entries: readonly JournalEntry[];
  terminalId: string;
  onClose: () => void;
}

type Verdict = ReturnType<Journal['verify']> | null;

const TYPE_COLOUR: Record<string, string> = {
  PAYMENT_TAKEN: 'var(--accent)',
  ORDER_COMPLETED: 'var(--accent)',
  LINE_VOIDED: 'var(--danger)',
  ORDER_DISCOUNTED: 'var(--warn)',
  LINE_DISCOUNTED: 'var(--warn)',
  NO_SALE: 'var(--warn)',
  ORDER_TYPE_CHANGED: 'var(--info)',
};

function describe(e: JournalEntry): string {
  const p = e.payload as Record<string, unknown>;
  switch (e.type) {
    case 'ORDER_OPENED':
      return `#${p.number} · ${p.table ?? 'counter'} · ${p.orderType}`;
    case 'LINE_ADDED':
      return `${p.product}${Array.isArray(p.modifiers) && p.modifiers.length ? ` (${(p.modifiers as string[]).join(', ')})` : ''}`;
    case 'LINE_QTY_CHANGED':
      return `qty ${Number(p.delta) > 0 ? '+' : ''}${p.delta}`;
    case 'LINE_VOIDED':
      return `${p.product}${p.wasSent ? ' — after sending to kitchen' : ''}`;
    case 'ORDER_DISCOUNTED':
      return `${p.percent}% off the bill`;
    case 'LINE_DISCOUNTED':
      return `${p.percent}% off one line`;
    case 'SERVICE_CHARGE_SET':
      return `${p.percent}% service`;
    case 'ORDER_TYPE_CHANGED':
      return `${p.from} → ${p.to} · ${formatMoney(Number(p.totalBefore))} → ${formatMoney(Number(p.totalAfter))}`;
    case 'ORDER_SENT':
      return `${p.lines} items → ${(p.stations as string[])?.join(', ')}`;
    case 'PAYMENT_TAKEN':
      return `${p.tender} ${formatMoney(Number(p.amount))}${p.authCode ? ` · auth ${p.authCode}` : ''}`;
    case 'ORDER_COMPLETED':
      return `#${p.number} · ${formatMoney(Number(p.total))} (VAT ${formatMoney(Number(p.vat))})`;
    case 'AGE_CHECK':
      return `${p.product} · ${p.passed ? 'passed' : 'refused'}`;
    default:
      return JSON.stringify(p).slice(0, 90);
  }
}

export function JournalDrawer({ entries, terminalId, onClose }: Props) {
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [tamperedSeq, setTamperedSeq] = useState<number | null>(null);

  const build = (): Journal => {
    let list = [...entries];
    if (tamperedSeq !== null) {
      list = list.map((e) =>
        e.seq === tamperedSeq
          ? { ...e, payload: { ...e.payload, amount: 100, product: 'ALTERED' } }
          : e,
      );
    }
    return Journal.hydrate(terminalId, list);
  };

  const verify = () => setVerdict(build().verify());

  const tamper = () => {
    // Pick something financially meaningful, the way a suppression tool would.
    const target =
      [...entries].reverse().find((e) => e.type === 'PAYMENT_TAKEN') ??
      [...entries].reverse().find((e) => e.type === 'LINE_ADDED');
    if (!target) return;
    setTamperedSeq(target.seq);
    setVerdict(null);
  };

  const reset = () => {
    setTamperedSeq(null);
    setVerdict(null);
  };

  const shown = build().all();

  return (
    <>
      <div className="scrim" onClick={onClose} style={{ background: 'rgba(6,8,12,.5)' }} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Sales journal">
        <div className="sheet-head">
          <div style={{ flex: 1 }}>
            <div className="sheet-title">Sales journal</div>
            <div className="sheet-sub">
              {terminalId} · {entries.length} entries · append-only, hash-chained
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close journal">×</button>
        </div>

        <div className="verify-bar">
          <div className={`verify-state ${verdict ? (verdict.ok ? 'ok' : 'bad') : 'idle'}`}>
            {!verdict && (
              <>
                <span aria-hidden>◌</span>
                <span>Not verified this session</span>
              </>
            )}
            {verdict?.ok && (
              <>
                <span aria-hidden>✓</span>
                <span>
                  Chain intact · {verdict.count} entries
                  <span className="sub"> · head {shortHash(verdict.head)}</span>
                </span>
              </>
            )}
            {verdict && !verdict.ok && (
              <>
                <span aria-hidden>✕</span>
                <span>
                  Failed at entry {verdict.failedAt}
                  <span className="sub"> · {verdict.reason}</span>
                </span>
              </>
            )}
          </div>
          <button className="btn" style={{ height: 40 }} onClick={verify}>Verify</button>
        </div>

        <div className="entries">
          {shown.map((e) => (
            <div className={`entry ${e.seq === tamperedSeq ? 'tampered' : ''}`} key={e.seq}>
              <span className="entry-seq num">{String(e.seq).padStart(3, '0')}</span>
              <span className="entry-type" style={{ color: TYPE_COLOUR[e.type] ?? 'var(--text)' }}>
                {e.type.replace(/_/g, ' ').toLowerCase()}
              </span>
              <span className="entry-time num">
                {new Date(e.at).toLocaleTimeString('en-GB', { hour12: false })}
              </span>
              <span className="entry-payload">
                {describe(e)}
                {e.reasonCode && <span className="entry-reason"> · {e.reasonCode.replace(/_/g, ' ')}</span>}
              </span>
              <span className="entry-hash">
                <span className="hash-chip">{shortHash(e.prevHash)}</span>
                <span aria-hidden>→</span>
                <span className="hash-chip">{shortHash(e.hash)}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="drawer-foot">
          {tamperedSeq === null ? (
            <button className="btn danger grow" onClick={tamper}>
              Demo: alter entry after the fact
            </button>
          ) : (
            <button className="btn grow" onClick={reset}>Restore original entries</button>
          )}
          <button className="btn primary" onClick={verify}>Verify chain</button>
        </div>
      </aside>
    </>
  );
}
