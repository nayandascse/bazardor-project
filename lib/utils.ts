import type { Product } from "@/types/product";

export const bnNumber = (value: number | string) =>
  Number(value || 0).toLocaleString("bn-BD", { maximumFractionDigits: 1 });

export const money = (value: number | string) => `${bnNumber(value)} টাকা`;

export function productEmoji(category = "", name = "") {
  const s = `${category} ${name}`.toLowerCase();
  if (/চাল|rice|ডাল|lentil/.test(s)) return "🍚";
  if (/আলু|potato/.test(s)) return "🥔";
  if (/পেঁয়াজ|পিঁয়াজ|onion/.test(s)) return "🧅";
  if (/রসুন|garlic/.test(s)) return "🧄";
  if (/আদা|ginger/.test(s)) return "🫚";
  if (/মরিচ|chili|pepper/.test(s)) return "🌶️";
  if (/মাছ|fish|ইলিশ/.test(s)) return "🐟";
  if (/মুরগি|মাংস|chicken|meat/.test(s)) return "🍗";
  if (/ডিম|egg/.test(s)) return "🥚";
  if (/তেল|oil/.test(s)) return "🫙";
  if (/সবজি|vegetable|ঢেঁড়স|টমেটো/.test(s)) return "🥬";
  if (/দুধ|milk/.test(s)) return "🥛";
  return "🛍️";
}

export function normalizeProducts(payload: any): Product[] {
  const raw = Array.isArray(payload) ? payload : payload?.data ?? payload?.products ?? payload?.result ?? [];
  const items = Array.isArray(raw) ? raw : raw && typeof raw === "object" ? [raw] : [];
  return items.map((item: any, index: number) => {
    const categoryValue = item.category?.name ?? item.category_name ?? item.category ?? "অন্যান্য";
    const category = typeof categoryValue === "string" ? categoryValue : "অন্যান্য";
    const name = String(item.name ?? item.title ?? item.product_name ?? `পণ্য ${index + 1}`);
    const id = item.id ?? item._id ?? item.slug ?? index + 1;
    const price = Number(item.price ?? item.current_price ?? item.average_price ?? item.avgPrice ?? item.min_price ?? 0) || 0;
    const change = Number(item.change ?? item.change_percent ?? item.percentage_change ?? item.price_change ?? 0) || 0;
    const slug = String(item.slug ?? item.id ?? id).toLowerCase().replace(/[^\p{L}\p{N}-]+/gu, "-").replace(/^-|-$/g, "");
    const markets = item.markets ?? item.market_prices ?? item.bazars ?? item.prices ?? [];
    return {
      id, slug: slug || String(id), name,
      description: String(item.description ?? item.summary ?? `${name} এর সর্বশেষ বাজারদর ও বাজারভিত্তিক মূল্য দেখুন।`),
      category, categorySlug: String(item.category_slug ?? category.toLowerCase().replace(/\s+/g, "-")),
      unit: String(item.unit ?? item.unit_name ?? item.measurement ?? "প্রতি কেজি"),
      emoji: String(item.emoji ?? productEmoji(category, name)),
      price,
      minPrice: Number(item.min_price ?? item.minPrice ?? price) || price,
      maxPrice: Number(item.max_price ?? item.maxPrice ?? price) || price,
      averagePrice: Number(item.average_price ?? item.averagePrice ?? price) || price,
      change,
      markets: Array.isArray(markets) ? markets.map((m: any) => ({
        bazar: m.bazar ?? m.market ?? m.name ?? "স্থানীয় বাজার",
        market: m.market ?? m.bazar ?? m.name,
        name: m.name,
        minPrice: m.min_price ?? m.minPrice,
        maxPrice: m.max_price ?? m.maxPrice,
        price: m.price ?? m.current_price ?? m.average_price ?? price,
        averagePrice: m.average_price ?? m.averagePrice,
        unit: m.unit ?? item.unit ?? "প্রতি কেজি"
      })) : []
    } as Product;
  });
}

export function normalizeCategories(payload: any) {
  const raw = Array.isArray(payload) ? payload : payload?.data ?? payload?.categories ?? payload?.result ?? [];
  const items = Array.isArray(raw) ? raw : raw && typeof raw === "object" ? [raw] : [];
  return items.map((item: any, index: number) => {
    const name = String(item.name ?? item.title ?? item.category ?? `ক্যাটাগরি ${index + 1}`);
    return {
      id: item.id ?? item._id ?? index,
      name,
      slug: String(item.slug ?? item.category_slug ?? name.toLowerCase().replace(/\s+/g, "-")),
      icon: String(item.icon ?? productEmoji(name, name))
    };
  });
}
