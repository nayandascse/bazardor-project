"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Github, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) { toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে"); return; }
    if (password.length < 8) { toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের দিন"); return; }
    setBusy(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    setBusy(false);
    if (error) { toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি"); return; }
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন");
    router.push("/signin");
  }
  async function social(provider: "google" | "github") {
    const { error } = await authClient.signIn.social({ provider, callbackURL: "/" });
    if (error) toast.error(error.message || "সোশ্যাল সাইন আপ ব্যর্থ হয়েছে");
  }
  return <div className="container-main flex min-h-[70vh] items-center justify-center py-12"><div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-7 shadow-sm sm:p-9"><div className="mb-7 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-100 text-3xl">🌿</div><h1 className="mt-4 text-3xl font-black">নতুন অ্যাকাউন্ট খুলুন</h1><p className="mt-2 text-sm text-gray-500">বাজারদর তুলনা শুরু করুন</p></div>
    <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-bold">আপনার নাম<input required value={name} onChange={e=>setName(e.target.value)} placeholder="পুরো নাম" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"/></label><label className="block text-sm font-bold">ইমেইল<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"/></label><label className="block text-sm font-bold">পাসওয়ার্ড<input required type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder="কমপক্ষে ৮ অক্ষর" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"/></label><button disabled={busy} className="w-full rounded-xl bg-green-700 py-3.5 font-bold text-white disabled:opacity-60">{busy?"অ্যাকাউন্ট তৈরি হচ্ছে…":"সাইন আপ"}</button></form>
    <div className="my-5 flex items-center gap-3 text-xs text-gray-400"><span className="h-px flex-1 bg-gray-200"/>অথবা<span className="h-px flex-1 bg-gray-200"/></div><div className="grid grid-cols-2 gap-3"><button onClick={()=>social("google")} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold"><Mail size={17}/> Google</button><button onClick={()=>social("github")} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold"><Github size={17}/> GitHub</button></div>
    <p className="mt-6 text-center text-sm text-gray-500">আগেই অ্যাকাউন্ট আছে? <Link className="font-bold text-green-800" href="/signin">সাইন ইন</Link></p>
  </div></div>;
}
