import { normalizeCategories, normalizeProducts } from "@/lib/utils";
import type { Product, Category } from "@/types/product";

const bases = [
  process.env.BAZARDOR_API_URL ||
    "https://openapi.programming-hero.com/api/bazardor",

  process.env.BAZARDOR_API_FALLBACK_1 ||
    "https://api.api-store.workers.dev/api/bazardor",

  process.env.BAZARDOR_API_FALLBACK_2 ||
    "https://api.abcz.workers.dev/api/bazardor",
];

async function request(path: string) {
  for (const base of bases) {
    try {
      const response = await fetch(`${base}${path}`, { next: { revalidate: 300 } });
      if (!response.ok) continue;
      return await response.json();
    } catch { /* Try the next configured API. */ }
  }
  return null;
}

export async function getProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const data = await request(`/products${query}`);
  return normalizeProducts(data);
}
export async function getProduct(slug: string): Promise<Product | undefined> {
  const data = await request(`/products/${encodeURIComponent(slug)}`);
  const products = normalizeProducts(data?.data ? data : data);
  return products.find(p => p.slug === slug || String(p.id) === slug) ?? products[0];
}
export async function getCategories(): Promise<Category[]> {
  return normalizeCategories(await request("/categories"));
}
export async function getCategory(slug: string): Promise<Category | undefined> {
  const data = await request(`/categories/${encodeURIComponent(slug)}`);
  return normalizeCategories(data)[0];
}
