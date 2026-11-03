import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/api";
import CategoryClient from "./CategoryClient";

export const revalidate = 300;
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getProducts(slug)]);
  const category = categories.find(c => c.slug === slug || c.name === slug);
  const filtered = products.filter(p => p.categorySlug === slug || p.category.toLowerCase() === slug.toLowerCase() || products.length === 0);
  if (!category && filtered.length === 0) notFound();
  return <CategoryClient title={category?.name ?? filtered[0]?.category ?? slug} icon={category?.icon ?? "🛍️"} products={filtered.length ? filtered : products}/>;
}
