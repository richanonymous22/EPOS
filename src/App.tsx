import { useEffect, useState } from 'react';
import { modifierGroupById } from './core/catalogue';
import { VOID_REASON_LABELS } from './core/journal';
import { ProductGrid } from './ui/ProductGrid';
import { OrderPanel } from './ui/OrderPanel';
import { ModifierSheet } from './ui/ModifierSheet';
import { PaymentSheet } from './ui/PaymentSheet';
import { JournalDrawer } from './ui/JournalDrawer';
import { LABEL, useTill } from './ui/useTill';
import type { OrderType, Product, VoidReason } from './core/types';

const ORDER_TYPES: OrderType[] = ['eat_in', 'takeaway', 'delivery'];

export default function App() {
  const till = useTill();
  const [pending, setPending] = useState<Product | null>(null);
  const [ageCheck, setAgeCheck] = useState<Product | null>(null);
  const [voidingLineId, setVoidingLineId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('till-theme') as 'light' | 'dark') ?? 'light',
  );

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);

  // A daytime café and a late bar want opposite things from a screen.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('till-theme', theme);
  }, [theme]);

  /** Age-restricted first, then modifiers, then straight onto the bill. */
  const pick = (p: Product) => {
    if (p.ageRestricted) return setAgeCheck(p);
    openOrAdd(p);
  };

  const openOrAdd = (p: Product) => {
    const groups = (p.modifierGroupIds ?? []).map((id) => modifierGroupById.get(id)!).filter(Boolean);
    if (groups.length) setPending(p);
    else till.add(p);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-mark" aria-hidden>FV</div>
          <div>
            <div className="brand-name">The Fox &amp; Vine</div>
            <div className="brand-sub">Bermondsey · {till.terminalId}</div>
          </div>
        </div>

        <div className="divider" aria-hidden />

        <div className="segmented" role="group" aria-label="Order type">
          {ORDER_TYPES.map((t) => (
            <button
              key={t}
              aria-pressed={till.order.orderType === t}
              onClick={() => till.changeOrderType(t)}
            >
              {LABEL[t]}
            </button>
          ))}
        </div>

        <div className="spacer" />

        <button className="hchip" onClick={() => setJournalOpen(true)}>
          <span className="dot" aria-hidden />
          Journal <strong className="num">{till.entries.length}</strong>
        </button>

        <div className="hchip">
          <strong>{till.staff}</strong>
        </div>

        <div className="hchip num">
          {clock.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </div>

        <button
          className="hchip icon-only"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
      </header>

      <div className="body">
        <ProductGrid orderType={till.order.orderType} onPick={pick} />

        <OrderPanel
          order={till.order}
          totals={till.totals}
          flashLineId={till.flashLineId}
          selectedLineId={till.selectedLineId}
          onSelectLine={till.setSelectedLineId}
          onQty={till.qty}
          onVoid={setVoidingLineId}
          onDiscountLine={till.discountLine}
          onDiscount={() => till.setDiscount(till.order.orderDiscountPercent ? 0 : 10)}
          onService={till.toggleService}
          onSend={till.send}
          onPay={() => setPaying(true)}
          onNoSale={till.noSale}
        />
      </div>

      {ageCheck && (
        <div className="scrim" role="dialog" aria-modal="true" aria-label="Age verification">
          <div className="sheet" style={{ width: 'min(480px, 100%)' }}>
            <div className="sheet-head">
              <div style={{ flex: 1 }}>
                <div className="sheet-title">Challenge 25</div>
                <div className="sheet-sub">{ageCheck.name}</div>
              </div>
            </div>
            <div className="sheet-body">
              <div className="note warn">
                <span className="ic" aria-hidden>⚠</span>
                <span>
                  Age-restricted item. Check ID if the customer looks under 25. Your decision and
                  the verification method are written to the journal either way.
                </span>
              </div>
            </div>
            <div className="sheet-foot">
              <button
                className="btn danger"
                onClick={() => setAgeCheck(null)}
              >
                Refuse sale
              </button>
              <div style={{ flex: 1 }} />
              <button
                className="btn primary"
                onClick={() => {
                  till.ageCheck(ageCheck);
                  const p = ageCheck;
                  setAgeCheck(null);
                  openOrAdd(p);
                }}
              >
                ID checked — continue
              </button>
            </div>
          </div>
        </div>
      )}

      {pending && (
        <ModifierSheet
          product={pending}
          orderType={till.order.orderType}
          onCancel={() => setPending(null)}
          onConfirm={(mods) => {
            till.add(pending, mods);
            setPending(null);
          }}
        />
      )}

      {voidingLineId && (
        <div className="scrim" role="dialog" aria-modal="true" aria-label="Void reason">
          <div className="sheet" style={{ width: 'min(480px, 100%)' }}>
            <div className="sheet-head">
              <div style={{ flex: 1 }}>
                <div className="sheet-title">Why is this being voided?</div>
                <div className="sheet-sub">A reason is required — the line stays on the order</div>
              </div>
              <button className="icon-btn" onClick={() => setVoidingLineId(null)} aria-label="Cancel">×</button>
            </div>
            <div className="sheet-body">
              <div className="opts" style={{ gridTemplateColumns: '1fr' }}>
                {(Object.keys(VOID_REASON_LABELS) as VoidReason[]).map((r) => (
                  <button
                    key={r}
                    className="opt"
                    onClick={() => {
                      till.void_(voidingLineId, r);
                      setVoidingLineId(null);
                    }}
                  >
                    {VOID_REASON_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {paying && (
        <PaymentSheet
          totals={till.totals}
          orderNumber={till.order.number}
          onClose={() => setPaying(false)}
          onComplete={(tender, amount, meta) => {
            till.completePayment(tender, amount, meta);
            setPaying(false);
          }}
        />
      )}

      {journalOpen && (
        <JournalDrawer
          entries={till.entries}
          terminalId={till.terminalId}
          onClose={() => setJournalOpen(false)}
        />
      )}

      <div className="toasts" aria-live="polite">
        {till.toasts.map((t) => (
          <div className={`toast ${t.tone}`} key={t.id}>
            <span className="ic" aria-hidden>{t.icon}</span>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
