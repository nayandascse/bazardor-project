"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/types/product";

function SkeletonGrid() { return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i} className="h-64 rounded-3xl skeleton"/>)}</div>; }

export default function HomeClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  useEffect(() => {
    if (initialProducts.length) return;
    fetch("/api/products").then(r=>r.json()).then(setProducts).catch(()=>setProducts([])).finally(()=>setLoading(false));
  }, [initialProducts]);
  const risers = [...products].filter(p=>p.change>0).sort((a,b)=>b.change-a.change).slice(0,6);
  const fallers = [...products].filter(p=>p.change<0).sort((a,b)=>a.change-b.change).slice(0,6);
  return <>
    <section className="hero-pattern overflow-hidden">
      <div className="container-main grid min-h-[460px] items-center gap-8 py-12 md:grid-cols-[1.1fr_.9fr] md:py-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-bold text-green-800"><span className="h-2 w-2 rounded-full bg-green-600"/> প্রতিদিনের বাজার, এখন হাতের মুঠোয়</span>
          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.2] tracking-tight text-green-950 sm:text-5xl lg:text-6xl">বাজারের সঠিক দাম জানুন, <span className="text-green-700">সাশ্রয়ী থাকুন।</span></h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">চাল, ডাল, সবজি, মাছসহ নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর এক জায়গায়। কেনাকাটার আগে জেনে নিন দামের হালচাল।</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#সব-পণ্য" className="inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-900/15 transition hover:bg-green-800">সব পণ্য দেখুন <ArrowRight size={18}/></a><a href="#দাম-পরিবর্তন" className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-6 py-3.5 font-bold text-green-800">দামের পরিবর্তন <ArrowDown size={17}/></a></div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-gray-500"><span>✓ সহজে দাম তুলনা</span><span>✓ বাজারভিত্তিক তথ্য</span><span>✓ বাংলা ইন্টারফেস</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[400px]">
          <div className="absolute inset-8 rounded-full bg-green-200/50 blur-3xl"/>
          <Image src="/bazar-hero.png" alt="বাজারের তাজা পণ্যের ঝুড়ি" width={315} height={263} priority className="relative z-10 mx-auto w-[82%] drop-shadow-xl"/>
          <div className="relative z-10 mx-auto mt-2 max-w-[310px] rounded-2xl border border-white bg-white/90 p-4 shadow-lg"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">আজকের বাজার আপডেট</p><p className="mt-1 font-extrabold text-green-900">দাম তুলনা করুন সহজে</p></div><span className="rounded-xl bg-green-100 p-3 text-2xl">📊</span></div></div>
        </div>
      </div>
    </section>
    <section id="দাম-পরিবর্তন" className="container-main pt-14">
      <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-green-700">PRICE MOVEMENT</p><h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">আজকের দামের হালচাল</h2><p className="mt-2 text-gray-500">যে পণ্যগুলোর দামে সবচেয়ে বেশি পরিবর্তন হয়েছে</p></div></div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-green-100 bg-green-50/70 p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-green-100 p-3 text-green-700"><TrendingUp/></span><div><h3 className="text-lg font-extrabold">আজ দাম বেড়েছে ▲</h3><p className="text-sm text-gray-500">সর্বোচ্চ ৬টি বৃদ্ধি</p></div></div>{loading?<SkeletonGrid/>:<ProductGrid products={risers}/>}</div>
        <div className="rounded-3xl border border-red-100 bg-red-50/50 p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-red-100 p-3 text-red-600"><TrendingDown/></span><div><h3 className="text-lg font-extrabold">আজ দাম কমেছে ▼</h3><p className="text-sm text-gray-500">সর্বোচ্চ ৬টি হ্রাস</p></div></div>{loading?<SkeletonGrid/>:<ProductGrid products={fallers}/>}</div>
      </div>
    </section>
    <section id="সব-পণ্য" className="container-main scroll-mt-40 pt-16">
      <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-bold text-green-700">EXPLORE PRODUCTS</p><h2 className="mt-1 text-3xl font-extrabold">সব পণ্য</h2><p className="mt-2 text-gray-500">প্রয়োজনীয় পণ্যের বর্তমান দাম দেখুন এবং তুলনা করুন।</p></div><span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">{products.length.toLocaleString("bn-BD")}টি পণ্য</span></div>
      {loading ? <SkeletonGrid/> : <ProductGrid products={products}/>}
      {!loading && products.length===0 && <p className="mt-4 text-center text-sm text-gray-500">API থেকে পণ্যের তথ্য পাওয়া যায়নি। পরে আবার চেষ্টা করুন অথবা .env.local-এ API URL যাচাই করুন।</p>}
    </section>
  </>;
}
