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
  const raw = Array.isArray(payload)
    ? payload
    : payload?.data?.products ??
      payload?.data ??
      payload?.products ??
      payload?.result ??
      [];

  const items = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return items.map((item: any, index: number) => {
    const name = String(
      item.nameBn ??
      item.name ??
      item.title ??
      item.product_name ??
      `পণ্য ${index + 1}`
    );

    const category = String(
      item.categoryNameBn ??
      item.category_name ??
      item.category?.name ??
      item.category ??
      "অন্যান্য"
    );

    const price =
      Number(
        item.today ??
        item.price ??
        item.current_price ??
        item.average_price ??
        item.avgPrice ??
        item.min_price ??
        0
      ) || 0;

    const markets = Array.isArray(item.markets)
      ? item.markets.map((m: any) => ({
          bazar: m.market ?? m.bazar ?? m.name ?? "স্থানীয় বাজার",
          market: m.market ?? m.bazar ?? m.name,
          name: m.name,
          minPrice: m.min ?? m.min_price ?? m.minPrice ?? price,
          maxPrice: m.max ?? m.max_price ?? m.maxPrice ?? price,
          price:
  Number(
    m.price ??
    m.current_price ??
    (
      (Number(m.min ?? 0) + Number(m.max ?? 0)) / 2
    )
  ) || price,
          averagePrice: m.average_price ?? m.averagePrice,
          unit: item.unit ?? "kg",
        }))
      : [];

    const slug = String(item.slug ?? item.id ?? index + 1);

    return {
      id: item.id ?? item._id ?? index + 1,
      slug,
      name,
      description: String(
        item.description ??
        `${name} এর সর্বশেষ বাজারদর দেখুন।`
      ),
      category,
      categorySlug: String(
        item.categorySlug ??
        item.category_slug ??
        item.category ??
        "other"
      ),
      unit: String(item.unit ?? "kg"),
      emoji: String(item.image ?? item.emoji ?? productEmoji(category, name)),
      price,
      minPrice: Number(item.minPrice ?? item.min_price ?? price),
      maxPrice: Number(item.maxPrice ?? item.max_price ?? price),
      averagePrice: Number(item.averagePrice ?? item.average_price ?? price),
      change: Number(
        typeof item.change === "object"
          ? item.change?.pct
          : item.change ?? item.change_percent ?? 0
      ),
      markets,
    } as Product;
  });
}

export function normalizeCategories(payload: any) {
  const raw = Array.isArray(payload)
    ? payload
    : payload?.data?.categories ??
      payload?.data ??
      payload?.categories ??
      payload?.result ??
      [];

  const items = Array.isArray(raw) ? raw : [];

  return items.map((item: any, index: number) => {
    const name = String(
      item.nameBn ??
      item.name ??
      item.category_name ??
      item.categoryName ??
      item.title ??
      item.category ??
      `ক্যাটাগরি ${index + 1}`
    );

    return {
      id: item.id ?? item._id ?? index,
      name,
      slug: String(
        item.slug ??
        item.category_slug ??
        item.id ??
        name.toLowerCase().replace(/\s+/g, "-")
      ),
      icon: String(item.icon ?? productEmoji(name, name)),
      image: item.image ?? item.image_url ?? item.category_image ?? item.thumbnail ?? "",
    };
  });
}