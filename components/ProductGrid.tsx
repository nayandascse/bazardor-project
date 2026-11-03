import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="rounded-3xl border border-dashed border-green-200 bg-white px-5 py-16 text-center"><div className="text-5xl">🧺</div><h3 className="mt-4 text-xl font-bold">কোনো পণ্য পাওয়া যায়নি</h3><p className="mt-2 text-gray-500">অন্য ক্যাটাগরি নির্বাচন করে আবার চেষ্টা করুন।</p></div>;
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map(p => <ProductCard key={p.id} product={p}/>)}</div>;
}
