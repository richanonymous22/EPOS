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
    <div className="grid-wrap">
      <nav className="tabs" aria-label="Menu categories">
        {categories.map((c) => (
          <button
            key={c.id}
            className="tab"
            aria-pressed={!query && categoryId === c.id}
            onClick={() => { setCategoryId(c.id); setQuery(''); }}
            style={{ ['--cat' as string]: c.colour }}
          >
            <span className="swatch" aria-hidden />
            {c.name}
          </button>
        ))}
      </nav>

      <div className="grid-head">
        <span className="grid-title">{query ? `“${query}”` : category?.name}</span>
        <span className="grid-count num">{shown.length} items</span>

        <label className="search">
          <span aria-hidden style={{ color: 'var(--ink-4)' }}>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu…"
            aria-label="Search the menu"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search" style={{ color: 'var(--ink-3)', fontSize: 17 }}>
              ×
            </button>
          )}
        </label>
      </div>

      <div className="grid" role="list">
        {shown.map((p) => {
          const cat = categories.find((c) => c.id === p.categoryId);
          const price = priceFor(p, orderType);
          const zeroRated = resolveVatRate(p.vatClass, orderType) === 0;

          return (
            <button
              key={p.id}
              role="listitem"
              className="tile"
              style={{ ['--cat' as string]: cat?.colour ?? 'var(--ink-4)' }}
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

        {!shown.length && <div className="empty">No items match “{query}”.</div>}
      </div>
    </div>
  );
}
