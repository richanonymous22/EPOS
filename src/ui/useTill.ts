import { useCallback, useMemo, useRef, useState } from 'react';
import { Journal, type JournalEntry } from '../core/journal';
import { products } from '../core/catalogue';
import {
  addLine, changeQty, computeTotals, markSent, setLineDiscount, setOrderType, voidLine,
} from '../core/order';
import type {
  Order, OrderType, Product, SelectedModifier, VoidReason,
} from '../core/types';

const TERMINAL_ID = 'TILL-01';
const STAFF = 'Sam Okafor';

let orderSeq = 1041;

function freshOrder(orderType: OrderType, table?: string): Order {
  return {
    id: `O${Date.now().toString(36)}`,
    number: ++orderSeq,
    orderType,
    tableName: table,
    covers: table ? 2 : undefined,
    lines: [],
    openedAt: Date.now(),
    staffName: STAFF,
  };
}

export interface Toast {
  id: number;
  tone: 'good' | 'bad' | 'plain';
  icon: string;
  text: string;
}

export function useTill() {
  const journalRef = useRef(new Journal(TERMINAL_ID));
  const [journalVersion, bumpJournal] = useState(0);
  const [order, setOrder] = useState<Order>(() => {
    const o = freshOrder('eat_in', 'T12');
    return o;
  });
  const [flashLineId, setFlashLineId] = useState<string | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const journal = journalRef.current;

  const log = useCallback(
    (
      type: Parameters<Journal['append']>[0],
      payload: Record<string, unknown> = {},
      reason?: string,
    ) => {
      journalRef.current.append(type, STAFF, payload, reason);
      bumpJournal((v) => v + 1);
    },
    [],
  );

  const toast = useCallback((text: string, tone: Toast['tone'] = 'plain', icon = '•') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tone, icon, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // Open the first order's journal entry once, lazily.
  const openedRef = useRef(false);
  if (!openedRef.current) {
    openedRef.current = true;
    journal.append('ORDER_OPENED', STAFF, {
      orderId: order.id,
      number: order.number,
      table: order.tableName,
      orderType: order.orderType,
    });
  }

  const totals = useMemo(() => computeTotals(order), [order]);

  const add = useCallback(
    (product: Product, modifiers: SelectedModifier[] = []) => {
      setOrder((o) => {
        const { order: next, line } = addLine(o, product, modifiers);
        setFlashLineId(line.id);
        setTimeout(() => setFlashLineId((f) => (f === line.id ? null : f)), 640);
        return next;
      });
      log('LINE_ADDED', {
        product: product.name,
        productId: product.id,
        vatClass: product.vatClass,
        modifiers: modifiers.map((m) => m.name),
      });
    },
    [log],
  );

  const qty = useCallback(
    (lineId: string, delta: number) => {
      setOrder((o) => changeQty(o, lineId, delta));
      log('LINE_QTY_CHANGED', { lineId, delta });
    },
    [log],
  );

  const void_ = useCallback(
    (lineId: string, reason: VoidReason) => {
      const line = order.lines.find((l) => l.id === lineId);
      setOrder((o) => voidLine(o, lineId, reason, STAFF));
      setSelectedLineId(null);
      log('LINE_VOIDED', { lineId, product: line?.name, wasSent: !!line?.sent }, reason);
      toast(`Voided ${line?.name ?? 'line'} — reason recorded`, 'plain', '⌫');
    },
    [log, order.lines, toast],
  );

  const discountLine = useCallback(
    (lineId: string, percent: number) => {
      setOrder((o) => setLineDiscount(o, lineId, percent));
      log('LINE_DISCOUNTED', { lineId, percent }, 'manager_discount');
    },
    [log],
  );

  const setDiscount = useCallback(
    (percent: number) => {
      setOrder((o) => ({ ...o, orderDiscountPercent: percent || undefined }));
      log('ORDER_DISCOUNTED', { percent }, 'manager_discount');
      toast(percent ? `${percent}% discount applied to the bill` : 'Discount removed', 'plain', '%');
    },
    [log, toast],
  );

  const toggleService = useCallback(() => {
    setOrder((o) => {
      const next = o.serviceChargePercent ? undefined : 12.5;
      return { ...o, serviceChargePercent: next };
    });
    log('SERVICE_CHARGE_SET', { percent: order.serviceChargePercent ? 0 : 12.5 });
  }, [log, order.serviceChargePercent]);

  const changeOrderType = useCallback(
    (t: OrderType) => {
      if (t === order.orderType) return;
      const before = computeTotals(order).total;
      const next = setOrderType(order, t, products);
      const after = computeTotals(next).total;
      setOrder(next);
      log('ORDER_TYPE_CHANGED', { from: order.orderType, to: t, totalBefore: before, totalAfter: after });

      if (order.lines.length && before !== after) {
        toast(
          `Re-priced for ${LABEL[t].toLowerCase()} — VAT and prices updated`,
          'good',
          '⇄',
        );
      }
    },
    [log, order, toast],
  );

  const send = useCallback(() => {
    const toSend = order.lines.filter((l) => !l.sent && !l.voided);
    if (!toSend.length) return;
    setOrder((o) => markSent(o));
    log('ORDER_SENT', { lines: toSend.length, stations: [...new Set(toSend.map((l) => l.station))] });
    toast(`${toSend.length} item${toSend.length > 1 ? 's' : ''} sent to kitchen & bar`, 'good', '✓');
  }, [log, order.lines, toast]);

  const completePayment = useCallback(
    (tender: 'cash' | 'card', amount: number, meta: Record<string, unknown> = {}) => {
      log('PAYMENT_TAKEN', { tender, amount, ...meta });
      log('ORDER_COMPLETED', {
        orderId: order.id,
        number: order.number,
        total: totals.total,
        net: totals.net,
        vat: totals.vat,
        items: totals.itemCount,
      });
      const next = freshOrder(order.orderType, order.tableName);
      setOrder(next);
      setSelectedLineId(null);
      journalRef.current.append('ORDER_OPENED', STAFF, {
        orderId: next.id,
        number: next.number,
        table: next.tableName,
        orderType: next.orderType,
      });
      bumpJournal((v) => v + 1);
      toast(`Order #${order.number} paid — receipt printed`, 'good', '✓');
    },
    [log, order, totals, toast],
  );

  const noSale = useCallback(() => {
    log('NO_SALE', { drawer: 1 }, 'no_sale_manager');
    toast('Drawer opened — logged to the journal', 'plain', '⊟');
  }, [log, toast]);

  const ageCheck = useCallback(
    (product: Product) => {
      log('AGE_CHECK', { product: product.name, method: 'challenge_25_visual', passed: true });
    },
    [log],
  );

  const entries: readonly JournalEntry[] = journal.all();

  return {
    order, totals, entries, journal, journalVersion,
    flashLineId, selectedLineId, setSelectedLineId, toasts,
    add, qty, void_, discountLine, setDiscount, toggleService,
    changeOrderType, send, completePayment, noSale, ageCheck, toast,
    staff: STAFF, terminalId: TERMINAL_ID,
  };
}

export const LABEL: Record<OrderType, string> = {
  eat_in: 'Eat in',
  takeaway: 'Takeaway',
  delivery: 'Delivery',
};
