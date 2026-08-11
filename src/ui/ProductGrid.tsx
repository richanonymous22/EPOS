import { useMemo, useState } from 'react';
import { categories, products } from '../core/catalogue';
import { formatMoney } from '../core/money';
import { priceFor } from '../core/order';
import { resolveVatRate } from '../core/vat';
import type { OrderType, Product } from '../core/types';

interface Props {
  orderType: OrderType;
  onPick: (p: Product) => void;
}

export function CategoryRail({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="rail" aria-label="Menu categories">
      {categories.map((c) => (
        <button
          key={c.id}
          className="rail-btn"
          aria-pressed={active === c.id}
          onClick={() => onChange(c.id)}
          style={{ ['--hue' as string]: c.hue }}
        >
          <span className="ico" aria-hidden>{c.icon}</span>
          <span className="lbl">{c.name}</span>
        </button>
      ))}
    </nav>
  );
}

export function ProductGrid({ orderType, onPick }: Props) {
  const [categoryId, setCategoryId] = useState('draught');
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return products.filter((p) => p.name.toLowerCase().includes(q));
    return products.filter((p) => p.categoryId === categoryId);
  }, [categoryId, query]);

  const category = categories.find((c) => c.id === categoryId);

  return (
    <>
      <CategoryRail active={categoryId} onChange={(id) => { setCategoryId(id); setQuery(''); }} />

      <div className="grid-wrap">
        <div className="grid-head">
          <div>
            <div className="grid-title">
              {query ? `“${query}”` : category?.name}
            </div>
          </div>
          <span className="grid-count num">{shown.length} items</span>

          <label className="search">
            <span aria-hidden style={{ color: 'var(--text-faint)' }}>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu…"
              aria-label="Search the menu"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                style={{ color: 'var(--text-faint)', fontSize: 16 }}
              >
                ×
              </button>
            )}
          </label>
        </div>

        <div className="grid" role="list">
          {shown.map((p) => {
            const cat = categories.find((c) => c.id === p.categoryId);
            const price = priceFor(p, orderType);
            const rate = resolveVatRate(p.vatClass, orderType);
            const zeroRated = rate === 0;

            return (
              <button
                key={p.id}
                role="listitem"
                className="tile"
                style={{ ['--hue' as string]: cat?.hue ?? 200 }}
                onClick={() => onPick(p)}
                aria-label={`${p.name}, ${formatMoney(price)}`}
              >
                <span className="tile-name">{p.name}</span>
                <span className="tile-foot">
                  <span className="tile-price num">{formatMoney(price)}</span>
                  <span className="tile-meta">
                    {p.ageRestricted && <span className="pill age" title="Age restricted">25</span>}
                    {p.modifierGroupIds?.length ? <span className="pill mod">opt</span> : null}
                    {zeroRated && <span className="pill zero" title="Zero-rated for VAT">0%</span>}
                  </span>
                </span>
              </button>
            );
          })}

          {!shown.length && (
            <div className="empty">
              No items match “{query}”.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
