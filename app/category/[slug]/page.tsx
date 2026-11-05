import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/api";
import CategoryClient from "./CategoryClient";

export const revalidate = 300;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(slug),
  ]);

  const normalizedSlug = decodeURIComponent(slug).toLowerCase();

  const category = categories.find(
    (c) =>
      c.slug.toLowerCase() === normalizedSlug ||
      c.name.toLowerCase() === normalizedSlug
  );

  const filtered = category
    ? products.filter(
        (p) =>
          p.categorySlug === category.slug ||
          p.category.toLowerCase() === category.name.toLowerCase()
      )
    : products;

  if (!category && products.length === 0) {
    notFound();
  }

  return (
    <CategoryClient
      title={category?.name ?? filtered[0]?.category ?? slug}
      icon={category?.icon ?? "🛍️"}
      image={category?.image}
      products={filtered}
    />
  );
}