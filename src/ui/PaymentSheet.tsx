import { useEffect, useState } from 'react';
import { formatMoney } from '../core/money';
import { cashSuggestions, changeDue } from '../core/order';
import type { OrderTotals } from '../core/types';

type Stage = 'choose' | 'cash' | 'card_sending' | 'card_present' | 'card_approved';

interface Props {
  totals: OrderTotals;
  orderNumber: number;
  onClose: () => void;
  onComplete: (tender: 'cash' | 'card', amount: number, meta?: Record<string, unknown>) => void;
}

/** Stand-in for a real acquirer adapter. The shape of what comes back is the point. */
interface CardResult {
  scheme: string;
  last4: string;
  authCode: string;
  aid: string;
  entryMode: string;
  terminalId: string;
  acquirerRef: string;
}

function fakeAuthorisation(): CardResult {
  const rnd = (n: number) => Math.floor(Math.random() * n).toString().padStart(String(n).length - 1, '0');
  return {
    scheme: 'Visa Debit',
    last4: rnd(10000),
    authCode: `0${rnd(100000)}`.slice(-6).toUpperCase(),
    aid: 'A0000000031010',
    entryMode: 'Contactless',
    terminalId: 'DOJO-A80-0294',
    acquirerRef: `TX${Date.now().toString(36).toUpperCase()}`,
  };
}

export function PaymentSheet({ totals, orderNumber, onClose, onComplete }: Props) {
  const [stage, setStage] = useState<Stage>('choose');
  const [entry, setEntry] = useState('');
  const [card, setCard] = useState<CardResult | null>(null);

  const tenderedPence = entry ? Number(entry) : 0;
  const change = changeDue(totals.total, tenderedPence);
  const enough = tenderedPence >= totals.total;

  // Simulated terminal round-trip. A real adapter awaits the acquirer here, and
  // must be able to recover this exact state if the till restarts mid-flight.
  useEffect(() => {
    if (stage === 'card_sending') {
      const t = setTimeout(() => setStage('card_present'), 900);
      return () => clearTimeout(t);
    }
    if (stage === 'card_present') {
      const t = setTimeout(() => {
        setCard(fakeAuthorisation());
        setStage('card_approved');
      }, 1700);
      return () => clearTimeout(t);
    }
    return;
  }, [stage]);

  const key = (k: string) => {
    if (k === 'C') return setEntry('');
    if (k === '⌫') return setEntry((e) => e.slice(0, -1));
    setEntry((e) => (e.length < 7 ? (e === '' && k === '0' ? '' : e + k) : e));
  };

  return (
    <div className="scrim" role="dialog" aria-modal="true" aria-label="Take payment">
      <div className="sheet wide">
        <div className="sheet-head">
          <div style={{ flex: 1 }}>
            <div className="sheet-title">
              {stage === 'choose' && 'Take payment'}
              {stage === 'cash' && 'Cash'}
              {stage.startsWith('card') && 'Card'}
            </div>
            <div className="sheet-sub">Order #{orderNumber}</div>
          </div>
          {stage !== 'card_approved' && (
            <button className="icon-btn" onClick={onClose} aria-label="Cancel payment">×</button>
          )}
        </div>

        <div className="sheet-body">
          {stage === 'choose' && (
            <div className="pay-grid">
              <div className="pay-summary">
                <div className="pay-due-label">Amount due</div>
                <div className="pay-due num">{formatMoney(totals.total)}</div>

                {totals.vatByRate.map((r) => (
                  <div className="vat-row" key={r.rate}>
                    <span className="rate">
                      <span className={`vat-badge ${r.rate === 0 ? 'zero' : ''}`}>
                        {r.rate === 0 ? 'Zero-rated' : `VAT ${r.rate}%`}
                      </span>
                      <span className="num">on {formatMoney(r.gross)}</span>
                    </span>
                    <b className="num">{formatMoney(r.vat)}</b>
                  </div>
                ))}
                {totals.serviceCharge > 0 && (
                  <div className="vat-row" style={{ marginTop: 6 }}>
                    <span>Includes service charge</span>
                    <b className="num">{formatMoney(totals.serviceCharge)}</b>
                  </div>
                )}
              </div>

              <div className="tenders">
                <button className="tender primary" onClick={() => setStage('card_sending')}>
                  <span className="ic" aria-hidden>▭</span>
                  Card
                  <span className="hint">Send to terminal</span>
                </button>
                <button className="tender" onClick={() => setStage('cash')}>
                  <span className="ic" aria-hidden>£</span>
                  Cash
                  <span className="hint">Open drawer</span>
                </button>
                <button className="tender" disabled style={{ opacity: 0.45, cursor: 'not-allowed' }}>
                  <span className="ic" aria-hidden>⇄</span>
                  Split bill
                  <span className="hint">Not built yet</span>
                </button>
                <button className="tender" disabled style={{ opacity: 0.45, cursor: 'not-allowed' }}>
                  <span className="ic" aria-hidden>◈</span>
                  Pay by Bank
                  <span className="hint">Not built yet</span>
                </button>
              </div>
            </div>
          )}

          {stage === 'cash' && (
            <div className="pay-grid">
              <div>
                <div className="tendered-display">
                  <span className="l">Tendered</span>
                  <span className="v num">{formatMoney(tenderedPence)}</span>
                </div>
                <div className="tendered-display" style={{ marginBottom: 16 }}>
                  <span className="l">{enough ? 'Change due' : 'Still owing'}</span>
                  <span className={`v num ${enough ? 'change' : ''}`}>
                    {enough ? formatMoney(change) : formatMoney(totals.total - tenderedPence)}
                  </span>
                </div>

                <div className="quick">
                  {cashSuggestions(totals.total).map((v) => (
                    <button key={v} className="num" onClick={() => setEntry(String(v))}>
                      {formatMoney(v)}
                    </button>
                  ))}
                </div>

                <div className="note">
                  <span className="ic" aria-hidden>ℹ</span>
                  <span>
                    Amount due <b className="num">{formatMoney(totals.total)}</b>. Enter what the
                    customer handed over — the drawer opens on completion and the movement is
                    written to the journal.
                  </span>
                </div>
              </div>

              <div className="keypad">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                  <button key={k} className={`key ${k === 'C' || k === '⌫' ? 'wide' : ''}`} onClick={() => key(k)}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(stage === 'card_sending' || stage === 'card_present') && (
            <div className={`terminal ${stage === 'card_present' ? 'waiting' : ''}`}>
              <div className="terminal-icon" aria-hidden>{stage === 'card_sending' ? '⇢' : '▭'}</div>
              <div className="terminal-status">
                {stage === 'card_sending'
                  ? `Sending ${formatMoney(totals.total)} to terminal…`
                  : 'Present card'}
              </div>
              <div className="terminal-detail">
                {stage === 'card_sending'
                  ? 'The till sends only the amount and a reference. It never sees the card number.'
                  : 'The terminal is handling the card, the PIN and the encryption. Waiting for the acquirer’s response.'}
              </div>
              <div className="note" style={{ maxWidth: 420 }}>
                <span className="ic" aria-hidden>ℹ</span>
                <span>
                  Semi-integrated flow. Card data never enters this application, which is what
                  keeps the software out of PCI Secure Software Standard scope.
                </span>
              </div>
            </div>
          )}

          {stage === 'card_approved' && card && (
            <div className="terminal approved">
              <div className="terminal-icon" aria-hidden style={{ color: 'var(--accent)' }}>✓</div>
              <div className="terminal-status" style={{ color: 'var(--accent)' }}>
                Approved · {formatMoney(totals.total)}
              </div>
              <dl className="receipt-meta">
                <dt>Scheme</dt><dd>{card.scheme}</dd>
                <dt>Card</dt><dd className="num">•••• {card.last4}</dd>
                <dt>Auth code</dt><dd className="num">{card.authCode}</dd>
                <dt>Entry mode</dt><dd>{card.entryMode}</dd>
                <dt>AID</dt><dd className="num">{card.aid}</dd>
                <dt>Terminal</dt><dd className="num">{card.terminalId}</dd>
                <dt>Acquirer ref</dt><dd className="num">{card.acquirerRef}</dd>
              </dl>
              <div className="note">
                <span className="ic" aria-hidden>ℹ</span>
                <span>
                  This is everything the till stores. No PAN, no expiry, no CVV — nothing that
                  would put this application in PCI scope.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="sheet-foot">
          {stage === 'cash' && (
            <>
              <button className="btn ghost" onClick={() => setStage('choose')}>Back</button>
              <div style={{ flex: 1 }} />
              <button
                className="btn primary"
                disabled={!enough}
                onClick={() =>
                  onComplete('cash', totals.total, { tendered: tenderedPence, change })
                }
              >
                Complete · change {formatMoney(change)}
              </button>
            </>
          )}

          {stage === 'card_approved' && card && (
            <button
              className="btn primary grow"
              onClick={() =>
                onComplete('card', totals.total, {
                  scheme: card.scheme,
                  last4: card.last4,
                  authCode: card.authCode,
                  acquirerRef: card.acquirerRef,
                  terminalId: card.terminalId,
                })
              }
            >
              Done · print receipt
            </button>
          )}

          {stage === 'choose' && (
            <>
              <button className="btn ghost" onClick={onClose}>Cancel</button>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                Choose a tender to continue
              </span>
            </>
          )}

          {(stage === 'card_sending' || stage === 'card_present') && (
            <>
              <button className="btn ghost" onClick={() => setStage('choose')}>Cancel on terminal</button>
              <div style={{ flex: 1 }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
