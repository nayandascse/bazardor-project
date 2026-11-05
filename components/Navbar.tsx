"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Category, Product } from "@/types/product";
import { money } from "@/lib/utils";

const Navbar = ({ categories, products }: { categories: Category[]; products: Product[] }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const logout = async () => {
    await authClient.signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  };
const links = [
  { name: "সব পণ্য", slug: "" },
  ...categories
    .filter((c) => c.name && c.slug)
    .map((c) => ({
      name: c.name.trim(),
      slug: c.slug,
    })),
].slice(0, 7);
  const tickerItems = products.slice(0, 12);
  return <header className="sticky top-0 z-40 border-b border-green-100 bg-white/95 backdrop-blur">
    <div className="container-main flex min-h-[78px] items-center justify-between gap-4 py-3">
      <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="বাজার দর হোম">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-green-700 text-2xl text-white shadow-sm">🛒</span>
        <span><strong className="block text-xl font-extrabold tracking-tight text-green-900">বাজার দর</strong><small className="text-xs text-gray-500">বুধবার, ২১ অক্টোবর ২০২৬</small></span>
      </Link>
      <nav className="hidden items-center justify-center gap-1 lg:flex">
        {links.map((link, i) => {
          const href = link.slug ? `/category/${encodeURIComponent(link.slug)}` : "/";
          const active = link.slug ? pathname === href : pathname === "/";
          return <Link key={link.slug || "all"} className={`nav-link ${active ? "active" : ""}`} href={href}>{link.name}</Link>;
        })}
      </nav>
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        {session?.user ? <>
          <Link href="/profile" className="flex items-center gap-2 rounded-full border border-green-100 px-3 py-2 text-sm font-semibold"><UserRound size={16}/>{session.user.name || "প্রোফাইল"}</Link>
          <button onClick={logout} className="rounded-full bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800"><LogOut className="mr-1 inline" size={15}/> সাইন আউট</button>
        </> : <>
          <Link href="/signin" className="rounded-full px-4 py-2 text-sm font-bold text-green-800 hover:bg-green-50">সাইন ইন</Link>
          <Link href="/signup" className="rounded-full bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800">সাইন আপ</Link>
        </>}
      </div>
      <button className="rounded-xl border p-2 sm:hidden" onClick={() => setMenuOpen(v => !v)} aria-label="মেনু">{menuOpen ? <X/> : <Menu/>}</button>
    </div>
    {menuOpen && <div className="container-main grid grid-cols-2 gap-2 pb-4 sm:hidden">
      {links.map(link => <Link onClick={() => setMenuOpen(false)} key={link.slug || "all"} href={link.slug ? `/category/${link.slug}` : "/"} className="nav-link">{link.name}</Link>)}
      <Link href="/signin" className="nav-link">সাইন ইন</Link><Link href="/signup" className="nav-link">সাইন আপ</Link>
    </div>}
    <div className="ticker"><div className="ticker-track py-2.5 text-sm">
      {[...tickerItems, ...tickerItems].map((p, i) => <span key={`${p.id}-${i}`} className="mx-7 inline-flex items-center gap-2"><span>{p.emoji}</span><span>{p.name}</span><b>{money(p.price)}</b><span className={p.change >= 0 ? "text-lime-300" : "text-red-300"}>{p.change > 0 ? "▲" : p.change < 0 ? "▼" : "—"} {Math.abs(p.change).toLocaleString("bn-BD")}%</span></span>)}
      {tickerItems.length === 0 && <span className="px-5">আজকের বাজারদর — সর্বশেষ মূল্য দেখতে পণ্য নির্বাচন করুন</span>}
    </div></div>
  </header>;
}
export default Navbar;