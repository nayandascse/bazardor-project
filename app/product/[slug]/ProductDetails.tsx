"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, MapPin, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import type { Product } from "@/types/product";
import { money } from "@/lib/utils";

export default function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন");
      router.replace(`/signin?callbackURL=${encodeURIComponent(`/product/${product.slug}`)}`);
    }
  }, [isPending, session, router, product.slug]);
  if (isPending || !session?.user) return <div className="container-main py-20"><div className="skeleton mx-auto h-72 max-w-3xl rounded-3xl"/></div>;
  const markets = product.markets.length ? product.markets : [{ bazar: "ঢাকা — গড় বাজারদর", price: product.price, minPrice: product.minPrice, maxPrice: product.maxPrice, unit: product.unit }, { bazar: "চট্টগ্রাম — আনুমানিক", price: product.averagePrice, unit: product.unit }, { bazar: "স্থানীয় বাজার — আনুমানিক", price: product.price, unit: product.unit }];
  return <div className="container-main py-10">
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-green-800"><ArrowLeft size={16}/> সব পণ্যে ফিরে যান</Link>
    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_.8fr]">
      <div className="rounded-3xl border border-green-100 bg-white p-6 sm:p-9"><div className="flex flex-wrap items-start gap-5"><div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-green-50 text-6xl">{product.emoji}</div><div className="flex-1"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">{product.category}</span><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">{product.unit}</span></div><h1 className="mt-3 text-3xl font-black">{product.name}</h1><p className="mt-3 leading-7 text-gray-600">{product.description}</p></div></div><div className="mt-8 rounded-2xl bg-green-800 p-5 text-white"><p className="text-sm text-green-100">আজকের গড় বাজারদর</p><p className="mt-1 text-3xl font-black">{money(product.averagePrice || product.price)}</p><p className="mt-2 text-sm text-green-100">দামের পরিবর্তন: {product.change > 0 ? "▲" : product.change < 0 ? "▼" : "—"} {Math.abs(product.change).toLocaleString("bn-BD")}%</p></div></div>
      <div className="rounded-3xl border border-green-100 bg-white p-6 sm:p-8"><h2 className="text-xl font-extrabold">দামের সারসংক্ষেপ</h2><div className="mt-5 space-y-3"><PriceRow label="সর্বনিম্ন দাম" value={money(product.minPrice || product.price)}/><PriceRow label="সর্বোচ্চ দাম" value={money(product.maxPrice || product.price)}/><PriceRow label="গড় দাম" value={money(product.averagePrice || product.price)}/></div><p className="mt-5 flex gap-2 text-xs leading-5 text-gray-500"><ShieldCheck size={16} className="shrink-0 text-green-700"/> মূল্যগুলো API-তে পাওয়া তথ্যের ভিত্তিতে দেখানো হয়েছে; বাজারভেদে পরিবর্তন হতে পারে।</p></div>
    </section>
    <section className="mt-10"><div className="mb-5"><p className="text-sm font-bold text-green-700">MARKET COMPARISON</p><h2 className="mt-1 text-2xl font-black">বাজারভিত্তিক আজকের দাম</h2><p className="mt-2 text-gray-500">বিভিন্ন বাজারে {product.name} এর সম্ভাব্য দাম</p></div><div className="overflow-hidden rounded-3xl border border-green-100 bg-white"><div className="grid grid-cols-[1fr_auto] gap-4 bg-green-50 px-5 py-4 text-sm font-bold text-green-900 sm:grid-cols-[1fr_1fr_auto]"><span>বাজারের নাম</span><span className="hidden sm:block">একক</span><span>আজকের দাম</span></div>{markets.map((m,i)=><div key={`${m.bazar}-${i}`} className="grid grid-cols-[1fr_auto] gap-4 border-t border-gray-100 px-5 py-5 sm:grid-cols-[1fr_1fr_auto]"><span className="flex items-center gap-3 font-semibold"><span className="rounded-xl bg-orange-50 p-2 text-orange-700"><MapPin size={17}/></span>{m.bazar ?? m.market ?? "স্থানীয় বাজার"}</span><span className="hidden self-center text-sm text-gray-500 sm:block">{m.unit ?? product.unit}</span><strong className="self-center text-green-800">{money(Number(m.price ?? m.averagePrice ?? product.price))}</strong></div>)}</div></section>
  </div>;
}
function PriceRow({label,value}:{label:string;value:string}) { return <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-4"><span className="text-sm text-gray-600">{label}</span><strong className="text-green-900">{value}</strong></div>; }
