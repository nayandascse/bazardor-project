
import type { Product } from "@/types/product";

// Convert number to Bangla number format
export const bnNumber = (value: number | string) =>
  Number(value || 0).toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });

// Format price in Bangla
export const money = (value: number | string) =>
  `${bnNumber(value)} টাকা`;

// Get product emoji based on category or name
export function productEmoji(category = "", name = "") {
  const s = `${category} ${name}`.toLowerCase();

  if (/চাল|rice|ডাল|lentil/.test(s)) return "🍚";
  if (/আলু|potato/.test(s)) return "🥔";
  if (/পেঁয়াজ|পিঁয়াজ|onion/.test(s)) return "🧅";
  if (/রসুন|garlic/.test(s)) return "🧄";
  if (/আদা|ginger/.test(s)) return "🥔";
  if (/মরিচ|chili|pepper/.test(s)) return "🌶️";
  if (/মাছ|fish|ইলিশ/.test(s)) return "🐟";
  if (/মুরগি|মাংস|chicken|meat/.test(s)) return "🍗";
  if (/ডিম|egg/.test(s)) return "🥚";
  if (/তেল|oil/.test(s)) return "🛢️";
  if (/সবজি|vegetable|ঢেঁড়স|টমেটো/.test(s)) return "🥬";
  if (/দুধ|milk/.test(s)) return "🥛";

  return "🛍️";
}

// Safely convert values to numbers
function toNumber(value: unknown, fallback = 0): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

// Normalize products
export function normalizeProducts(payload: unknown): Product[] {
  const data = payload as any;

  const raw = Array.isArray(data)
    ? data
    : data?.data?.products ??
      data?.data ??
      data?.products ??
      data?.result ??
      [];

  const items = Array.isArray(raw)
    ? raw
    : raw
      ? [raw]
      : [];

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

    const price = toNumber(
      item.today ??
        item.price ??
        item.current_price ??
        item.average_price ??
        item.avgPrice ??
        item.min_price,
      0
    );

    // Normalize market prices
    const markets = Array.isArray(item.markets)
      ? item.markets.map((m: any) => {
          const min = toNumber(
            m.min ??
              m.min_price ??
              m.minPrice,
            price
          );

          const max = toNumber(
            m.max ??
              m.max_price ??
              m.maxPrice,
            price
          );

          const marketPrice = toNumber(
            m.price ??
              m.current_price ??
              m.average_price ??
              m.averagePrice,
            (min + max) / 2
          );

          return {
            bazar:
              m.market ??
              m.bazar ??
              m.name ??
              "স্থানীয় বাজার",

            market: m.market ?? m.bazar ?? m.name,
            name: m.name,

            minPrice: min,
            maxPrice: max,
            price: marketPrice,

            averagePrice: toNumber(
              m.average_price ?? m.averagePrice,
              marketPrice
            ),

            unit: m.unit ?? item.unit ?? "kg",
          };
        })
      : [];

    // Calculate prices from market data
    const marketMins = markets
      .map((m) => toNumber(m.minPrice))
      .filter((v) => v > 0);

    const marketMaxs = markets
      .map((m) => toNumber(m.maxPrice))
      .filter((v) => v > 0);

    const marketPrices = markets
      .map((m) => toNumber(m.price))
      .filter((v) => v > 0);

    const calculatedMin = marketMins.length
      ? Math.min(...marketMins)
      : price;

    const calculatedMax = marketMaxs.length
      ? Math.max(...marketMaxs)
      : price;

    const calculatedAverage = marketPrices.length
      ? marketPrices.reduce((sum, value) => sum + value, 0) /
        marketPrices.length
      : price;

    // Product summary prices
    const minPrice = toNumber(
      item.minPrice ?? item.min_price,
      calculatedMin
    );

    const maxPrice = toNumber(
      item.maxPrice ?? item.max_price,
      calculatedMax
    );

    const averagePrice = toNumber(
      item.averagePrice ??
        item.average_price ??
        item.avgPrice,
      calculatedAverage
    );

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
          item.category?.slug ??
          item.category ??
          "other"
      ),

      unit: String(item.unit ?? "kg"),

      emoji: String(
        item.image ?? item.emoji ?? productEmoji(category, name)
      ),

      price,
      minPrice,
      maxPrice,
      averagePrice,

      change: toNumber(
        typeof item.change === "object"
          ? item.change?.pct
          : item.change ?? item.change_percent,
        0
      ),

      markets,
    } as Product;
  });
}

// Normalize categories
export function normalizeCategories(payload: unknown) {
  const data = payload as any;

  const raw = Array.isArray(data)
    ? data
    : data?.data?.categories ??
      data?.data ??
      data?.categories ??
      data?.result ??
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

      icon: String(
        item.icon ?? productEmoji(name, name)
      ),

      image:
        item.image ??
        item.image_url ??
        item.category_image ??
        item.thumbnail ??
        "",
    };
  });
}
