import { site } from "./site";

export function totals(subtotal: number, coupon: string | null, cod: boolean) {
  const discount = coupon && coupon.toUpperCase() === site.launchCode ? Math.round((subtotal * site.launchDiscountPct) / 100) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = subtotal === 0 || afterDiscount >= site.freeShippingAbove ? 0 : site.shippingFee;
  const codFee = cod && subtotal > 0 ? site.codFee : 0;
  return { discount, shipping, codFee, total: afterDiscount + shipping + codFee };
}

export const COUPON_KEY = "ruaa-coupon-v1";
