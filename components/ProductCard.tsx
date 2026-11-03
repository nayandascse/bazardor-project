import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { Product } from "@/types/product";
import { money } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const up = product.change > 0, down = product.change < 0;
  return <Link href={`/product/${encodeURIComponent(product.slug)}`} className="product-card group block">
    <div className="mb-5 flex items-start justify-between">
      <span className="grid h-[66px] w-[66px] place-items-center rounded-2xl bg-green-50 text-4xl group-hover:scale-105 transition">{product.emoji}</span>
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${up ? "bg-green-100 text-green-700" : down ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
        {up ? <ArrowUpRight size={14}/> : down ? <ArrowDownRight size={14}/> : <Minus size={13}/>}
        {Math.abs(product.change).toLocaleString("bn-BD")}%
      </span>
    </div>
    <p className="mb-1 text-xs font-semibold text-green-700">{product.category}</p>
    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
    <p className="mt-1 text-sm text-gray-500">{product.unit}</p>
    <div className="mt-5 flex items-end justify-between gap-2 border-t border-dashed border-gray-200 pt-4">
      <div><p className="text-xs text-gray-500">আজকের দাম</p><p className="mt-1 text-xl font-extrabold text-green-800">{money(product.price)}</p></div>
      <span className="text-xs font-semibold text-gray-400 group-hover:text-green-700">বিস্তারিত →</span>
    </div>
  </Link>;
}
