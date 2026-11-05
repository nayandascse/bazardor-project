
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/types/product";

interface CategoryClientProps {
  title: string;
  icon: string;
  image?: string;
  products: Product[];
}

export default function CategoryClient({
  title,
  icon,
  image,
  products,
}: CategoryClientProps) {
  const [sort, setSort] = useState("default");

  const sorted = useMemo(() => {
    const copy = [...products];

    if (sort === "asc") {
      copy.sort((a, b) => a.price - b.price);
    }

    if (sort === "desc") {
      copy.sort((a, b) => b.price - a.price);
    }

    return copy;
  }, [products, sort]);

  return (
    <div className="container-main py-12">
      <Link
        href="/"
        className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-green-800"
      >
        <ArrowLeft size={16} />
        হোম পেজ
      </Link>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-5xl">{icon}</div>
          
          <h1 className="mt-3 text-3xl font-black">{title}</h1>
          <p className="mt-2 text-gray-500">
            এই ক্যাটাগরির পণ্য ও আজকের বাজারদর
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          সাজান

          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 outline-none focus:border-green-500"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-3 top-3.5"
              size={16}
            />
          </span>
        </label>
      </div>

      <ProductGrid products={sorted} />
    </div>
  );
}
