import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { getProduct, getProducts } from "@/lib/api";
export const revalidate = 300;
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product = await getProduct(slug);
  if (!product) product = (await getProducts()).find(p => p.slug === slug || String(p.id) === slug);
  if (!product) notFound();
  return <ProductDetails product={product}/>;
}
