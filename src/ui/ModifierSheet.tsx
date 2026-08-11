import { useMemo, useState } from 'react';
import { modifierGroupById } from '../core/catalogue';
import { formatMoney } from '../core/money';
import { priceFor, unitWithModifiers, validateModifiers } from '../core/order';
import { vatClassLabel } from '../core/vat';
import type { OrderType, Product, SelectedModifier } from '../core/types';

interface Props {
  product: Product;
  orderType: OrderType;
  onCancel: () => void;
  onConfirm: (mods: SelectedModifier[]) => void;
}

export function ModifierSheet({ product, orderType, onCancel, onConfirm }: Props) {
  const groups = useMemo(
    () => (product.modifierGroupIds ?? []).map((id) => modifierGroupById.get(id)!).filter(Boolean),
    [product],
  );

  const [selected, setSelected] = useState<SelectedModifier[]>(() =>
    groups.flatMap((g) =>
      g.options
        .filter((o) => o.default)
        .map((o) => ({ groupId: g.id, optionId: o.id, name: o.name, priceDelta: o.priceDelta })),
    ),
  );

  const toggle = (groupId: string, optionId: string, name: string, priceDelta: number) => {
    const group = groups.find((g) => g.id === groupId)!;
    setSelected((cur) => {
      const already = cur.some((s) => s.groupId === groupId && s.optionId === optionId);
      if (already) {
        // A single-choice group must keep exactly one selection — don't let the
        // user deselect their way into an invalid state.
        if (group.min >= 1 && cur.filter((s) => s.groupId === groupId).length <= group.min) return cur;
        return cur.filter((s) => !(s.groupId === groupId && s.optionId === optionId));
      }
      const inGroup = cur.filter((s) => s.groupId === groupId);
      const next = { groupId, optionId, name, priceDelta };
      // Single-select replaces; multi-select drops the oldest once max is reached.
      if (group.max === 1) return [...cur.filter((s) => s.groupId !== groupId), next];
      if (inGroup.length >= group.max) {
        const oldest = inGroup[0]!;
        return [...cur.filter((s) => !(s.groupId === groupId && s.optionId === oldest.optionId)), next];
      }
      return [...cur, next];
    });
  };

  const validation = validateModifiers(groups, selected);
  const base = priceFor(product, orderType);
  const preview = unitWithModifiers({
    unitPrice: base,
    modifiers: selected,
  } as Parameters<typeof unitWithModifiers>[0]);

  return (
    <div className="scrim" role="dialog" aria-modal="true" aria-label={`Options for ${product.name}`}>
      <div className="sheet">
        <div className="sheet-head">
          <div style={{ flex: 1 }}>
            <div className="sheet-title">{product.name}</div>
            <div className="sheet-sub">
              {formatMoney(base)} · {vatClassLabel(product.vatClass, orderType)}
              {product.kcal ? ` · ${product.kcal} kcal` : ''}
            </div>
          </div>
          <button className="icon-btn" onClick={onCancel} aria-label="Cancel">×</button>
        </div>

        <div className="sheet-body">
          {product.allergens?.length ? (
            <div className="note warn" style={{ marginBottom: 16 }}>
              <span className="ic" aria-hidden>⚠</span>
              <span>
                <strong>Allergens:</strong>{' '}
                {product.allergens.join(', ')}. Check with the guest before sending.
              </span>
            </div>
          ) : null}

          {groups.map((g) => {
            const count = selected.filter((s) => s.groupId === g.id).length;
            const required = g.min > 0 && count < g.min;
            return (
              <div className="mgroup" key={g.id}>
                <div className="mgroup-head">
                  <span className="mgroup-name">{g.name}</span>
                  <span className={`mgroup-rule ${required ? 'req' : ''}`}>
                    {g.min > 0
                      ? `Choose ${g.min === g.max ? g.min : `${g.min}–${g.max}`}`
                      : `Optional · up to ${g.max}`}
                  </span>
                </div>
                <div className="opts">
                  {g.options.map((o) => {
                    const on = selected.some((s) => s.groupId === g.id && s.optionId === o.id);
                    return (
                      <button
                        key={o.id}
                        className="opt"
                        aria-pressed={on}
                        onClick={() => toggle(g.id, o.id, o.name, o.priceDelta)}
                      >
                        <span>{o.name}</span>
                        {o.priceDelta !== 0 && (
                          <span className="delta num">
                            {formatMoney(o.priceDelta, { sign: o.priceDelta > 0 })}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="sheet-foot">
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <div style={{ flex: 1 }} />
          <button
            className="btn primary"
            disabled={!validation.ok}
            onClick={() => onConfirm(selected)}
          >
            {validation.ok ? (
              <>
                Add to order
                <span className="num">{formatMoney(preview)}</span>
              </>
            ) : (
              validation.message
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
