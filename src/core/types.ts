import type { Pence } from './money';

/**
 * How the customer is taking the item. This is not cosmetic — it drives VAT.
 * See vat.ts.
 */
export type OrderType = 'eat_in' | 'takeaway' | 'delivery';

/**
 * A product's VAT character. The rate is NOT stored on the product, because in the
 * UK the same product can carry different rates depending on how it's sold.
 */
export type VatClass =
  /** Cold food: zero-rated to take away, standard-rated eaten in. */
  | 'cold_food'
  /** Hot food: standard-rated however it's sold. */
  | 'hot_food'
  /** Confectionery, crisps, soft drinks: standard-rated however they're sold. */
  | 'confectionery'
  /** Alcohol: standard-rated however it's sold. */
  | 'alcohol'
  /** Non-food goods: standard-rated. */
  | 'standard'
  /** Genuinely zero-rated goods (e.g. a plain loaf sold to take away). */
  | 'zero';

export interface ModifierOption {
  id: string;
  name: string;
  /** Added to (or subtracted from) the line price. May be 0 or negative. */
  priceDelta: Pence;
  /** Marks an option as the default selection when the sheet opens. */
  default?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  /** Minimum selections required before the line can be added. 0 = optional. */
  min: number;
  /** Maximum selections permitted. */
  max: number;
  options: ModifierOption[];
}

export interface Product {
  id: string;
  name: string;
  /** Short name for the receipt and the kitchen chit. */
  shortName?: string;
  categoryId: string;
  vatClass: VatClass;
  /** VAT-inclusive shelf price. UK retail prices are quoted gross. */
  price: Pence;
  /**
   * Optional channel price overrides. Delivery menus are typically uplifted to
   * absorb marketplace commission.
   */
  priceByOrderType?: Partial<Record<OrderType, Pence>>;
  modifierGroupIds?: string[];
  /** Food Information Regs: the 14 regulated allergens present in this item. */
  allergens?: Allergen[];
  /** Kilocalories per portion, for out-of-home calorie labelling. */
  kcal?: number;
  /** Age-restricted sales require an explicit verification step at the till. */
  ageRestricted?: boolean;
  /** Kitchen/bar routing target. */
  station?: 'kitchen' | 'bar' | 'none';
  available?: boolean;
}

export type Allergen =
  | 'celery' | 'cereals' | 'crustaceans' | 'eggs' | 'fish' | 'lupin' | 'milk'
  | 'molluscs' | 'mustard' | 'nuts' | 'peanuts' | 'sesame' | 'soya' | 'sulphites';

export interface Category {
  id: string;
  name: string;
  /** Accent colour — colour-coded categories are a real muscle-memory aid on a till. */
  colour: string;
}

export interface SelectedModifier {
  groupId: string;
  optionId: string;
  name: string;
  priceDelta: Pence;
}

export type VoidReason =
  | 'customer_changed_mind'
  | 'ordered_in_error'
  | 'kitchen_unable'
  | 'quality_issue'
  | 'manager_comp';

export interface OrderLine {
  id: string;
  productId: string;
  name: string;
  qty: number;
  /** Gross unit price at the moment the line was added, before modifiers. */
  unitPrice: Pence;
  modifiers: SelectedModifier[];
  vatClass: VatClass;
  station: 'kitchen' | 'bar' | 'none';
  /** Line-level discount as a percentage of the line gross. */
  discountPercent?: number;
  /** A voided line stays on the order for audit; it just stops contributing money. */
  voided?: { reason: VoidReason; at: number; by: string };
  addedAt: number;
  /** Set once the line has been sent to the kitchen — voiding after this is a P1 audit event. */
  sent?: boolean;
}

export interface Order {
  id: string;
  /** Human-facing order number, sequential per session. */
  number: number;
  orderType: OrderType;
  tableName?: string;
  covers?: number;
  lines: OrderLine[];
  /** Whole-order discount percentage, applied after line discounts. */
  orderDiscountPercent?: number;
  /**
   * Discretionary service charge percentage. Discretionary service is generally
   * outside the scope of VAT, so it is totalled separately and carries no VAT.
   */
  serviceChargePercent?: number;
  openedAt: number;
  staffName: string;
}

export interface LineTotals {
  lineId: string;
  /** Gross before any discount: (unit + modifiers) × qty */
  grossBeforeDiscount: Pence;
  discount: Pence;
  /** Gross actually charged. */
  gross: Pence;
  net: Pence;
  vat: Pence;
  vatRate: number;
}

export interface OrderTotals {
  lines: LineTotals[];
  /** Sum of line gross, after line discounts, before order discount. */
  subtotal: Pence;
  orderDiscount: Pence;
  /** Goods total actually charged, after every discount. Carries VAT. */
  goodsTotal: Pence;
  serviceCharge: Pence;
  /** Everything the customer pays. */
  total: Pence;
  net: Pence;
  vat: Pence;
  /**
   * VAT broken down by band, as required on a VAT receipt.
   *
   * Discretionary service charge gets its own band with `outOfScope`, because
   * "outside the scope of VAT" and "zero-rated" are different tax treatments and
   * merging them both misstates the return and confuses whoever reads the receipt.
   */
  vatByRate: {
    rate: number;
    net: Pence;
    vat: Pence;
    gross: Pence;
    outOfScope?: boolean;
  }[];
  itemCount: number;
}
