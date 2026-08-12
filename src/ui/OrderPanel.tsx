import { formatMoney } from '../core/money';
import { bandLabel } from '../core/vat';
import { unitWithModifiers } from '../core/order';
import { VOID_REASON_LABELS } from '../core/journal';
import type { Order, OrderTotals } from '../core/types';

interface Props {
  order: Order;
  totals: OrderTotals;
  flashLineId: string | null;
  selectedLineId: string | null;
  onSelectLine: (id: string | null) => void;
  onQty: (lineId: string, delta: number) => void;
  onVoid: (lineId: string) => void;
  onDiscountLine: (lineId: string, percent: number) => void;
  onDiscount: () => void;
  onService: () => void;
  onSend: () => void;
  onPay: () => void;
  onNoSale: () => void;
}

export function OrderPanel(p: Props) {
  const { order, totals } = p;
  const lineTotal = new Map(totals.lines.map((l) => [l.lineId, l]));
  const unsent = order.lines.filter((l) => !l.sent && !l.voided).length;

  return (
    <aside className="panel" aria-label="Current order">
      <div className="panel-head">
        <div style={{ flex: 1 }}>
          <div className="order-no num">Order #{order.number}</div>
          <div className="order-sub">
            {order.tableName ? `Table ${order.tableName}` : 'Counter'}
            {order.covers ? ` · ${order.covers} covers` : ''} · {order.staffName}
          </div>
        </div>
        <button className="icon-btn" onClick={p.onNoSale} title="No sale — open drawer" aria-label="No sale, open drawer">
          ⊟
        </button>
      </div>

      <div className="lines">
        {!order.lines.length && (
          <div className="panel-empty">
            <div className="big" aria-hidden>🧾</div>
            <div className="t">No items yet</div>
            <div className="s">
              Tap the menu to start the order.<br />
              Switching eat&nbsp;in / takeaway re-prices the bill.
            </div>
          </div>
        )}

        {order.lines.map((line) => {
          const lt = lineTotal.get(line.id);
          const selected = p.selectedLineId === line.id;
          const gross = lt?.gross ?? 0;

          return (
            <div
              key={line.id}
              className={[
                'line',
                selected ? 'selected' : '',
                line.voided ? 'voided' : '',
                p.flashLineId === line.id ? 'flash' : '',
              ].filter(Boolean).join(' ')}
            >
              <button
                className="line-main"
                onClick={() => p.onSelectLine(selected ? null : line.id)}
                aria-expanded={selected}
              >
                <span className="line-qty num">{line.qty}×</span>
                <span className="line-name">{line.name}</span>
              </button>
              <span className="line-price num">
                {line.voided ? formatMoney(0) : formatMoney(gross)}
              </span>

              {(line.modifiers.length > 0 || line.discountPercent) && (
                <div className="line-mods">
                  {line.modifiers.map((m) => (
                    <span key={m.optionId}>
                      {m.name}
                      {m.priceDelta !== 0 && (
                        <span className="plus num"> {formatMoney(m.priceDelta, { sign: m.priceDelta > 0 })}</span>
                      )}
                    </span>
                  ))}
                  {line.discountPercent ? (
                    <span className="disc-tag">−{line.discountPercent}%</span>
                  ) : null}
                </div>
              )}

              {line.voided && (
                <div className="void-tag">
                  <span aria-hidden>⌫</span>
                  Void · {VOID_REASON_LABELS[line.voided.reason]}
                </div>
              )}

              {selected && !line.voided && (
                <div className="line-actions">
                  <button className="mini wide" onClick={() => p.onQty(line.id, -1)} aria-label="Reduce quantity">−</button>
                  <button className="mini wide" onClick={() => p.onQty(line.id, +1)} aria-label="Increase quantity">+</button>
                  <button
                    className="mini"
                    onClick={() => p.onDiscountLine(line.id, line.discountPercent ? 0 : 50)}
                  >
                    {line.discountPercent ? 'Clear −50%' : '−50%'}
                  </button>
                  <button className="mini danger" onClick={() => p.onVoid(line.id)}>Void</button>
                  {line.sent && (
                    <span className="pill" style={{ alignSelf: 'center' }}>sent</span>
                  )}
                </div>
              )}

              {selected && line.modifiers.length === 0 && !line.voided && (
                <div className="line-mods" style={{ paddingTop: 0 }}>
                  <span className="num">{formatMoney(unitWithModifiers(line))} each</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="totals">
        {totals.itemCount > 0 && (
          <>
            <div className="trow">
              <span className="lbl">Subtotal · {totals.itemCount} item{totals.itemCount === 1 ? '' : 's'}</span>
              <span className="num">{formatMoney(totals.subtotal)}</span>
            </div>

            {totals.orderDiscount > 0 && (
              <div className="trow discount">
                <span className="lbl">Discount {order.orderDiscountPercent}%</span>
                <span className="num">−{formatMoney(totals.orderDiscount)}</span>
              </div>
            )}

            {totals.serviceCharge > 0 && (
              <div className="trow">
                <span className="lbl">Service {order.serviceChargePercent}%</span>
                <span className="num">{formatMoney(totals.serviceCharge)}</span>
              </div>
            )}

            {/* The VAT breakdown is the point of the whole engine — show it, always. */}
            <div className="vat-block">
              {totals.vatByRate.map((r, i) => {
                const b = bandLabel(r);
                return (
                  <div className="vat-row" key={`${r.rate}-${r.outOfScope ? 'oos' : i}`}>
                    <span className="rate">
                      <span className={`vat-badge ${b.zero ? 'zero' : ''}`}>{b.badge}</span>
                      <span className="num">on {formatMoney(r.gross)}</span>
                    </span>
                    <b className="num">{formatMoney(r.vat)}</b>
                  </div>
                );
              })}
              <div className="vat-row" style={{ marginTop: 3, paddingTop: 5, borderTop: '1px solid var(--line)' }}>
                <span>Net {formatMoney(totals.net)}</span>
                <b className="num">VAT {formatMoney(totals.vat)}</b>
              </div>
            </div>
          </>
        )}

        <div className="total-row">
          <span className="total-label">TOTAL</span>
          <span className="total-value num">{formatMoney(totals.total)}</span>
        </div>

        <div className="actions">
          <button
            className="act"
            onClick={p.onDiscount}
            aria-pressed={!!order.orderDiscountPercent}
          >
            Discount
            <span className="sub">{order.orderDiscountPercent ? `${order.orderDiscountPercent}% on` : '10% off'}</span>
          </button>
          <button
            className="act"
            onClick={p.onService}
            aria-pressed={!!order.serviceChargePercent}
          >
            Service
            <span className="sub">{order.serviceChargePercent ? 'on 12.5%' : 'add 12.5%'}</span>
          </button>
          <button className="act" onClick={p.onSend} disabled={!unsent}>
            Send
            <span className="sub">{unsent ? `${unsent} waiting` : 'all sent'}</span>
          </button>
        </div>

        <button className="pay-btn" onClick={p.onPay} disabled={totals.total <= 0}>
          <span>Pay</span>
          <span className="amt">{formatMoney(totals.total)}</span>
        </button>
      </div>
    </aside>
  );
}
