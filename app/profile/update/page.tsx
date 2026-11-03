"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function UpdateProfilePage() {
  const router=useRouter(); const {data:session,isPending}=authClient.useSession(); const [name,setName]=useState(""); const [busy,setBusy]=useState(false);
  useEffect(()=>{ if(session?.user?.name) setName(session.user.name); if(!isPending&&!session?.user){toast.error("আগে সাইন ইন করুন");router.replace("/signin?callbackURL=%2Fprofile%2Fupdate");}},[session,isPending,router]);
  async function submit(e:React.FormEvent){e.preventDefault();if(name.trim().length<2){toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");return;}setBusy(true);const {error}=await authClient.updateUser({name:name.trim()});setBusy(false);if(error){toast.error(error.message||"তথ্য আপডেট হয়নি");return;}toast.success("প্রোফাইল আপডেট হয়েছে");router.push("/profile");router.refresh();}
  if(isPending||!session?.user)return <div className="container-main py-20"><div className="skeleton mx-auto h-64 max-w-xl rounded-3xl"/></div>;
  return <div className="container-main flex min-h-[60vh] items-center justify-center py-14"><form onSubmit={submit} className="w-full max-w-xl rounded-3xl border border-green-100 bg-white p-8 sm:p-10"><h1 className="text-3xl font-black">তথ্য আপডেট করুন</h1><p className="mt-2 text-gray-500">আপনার প্রোফাইলের নাম পরিবর্তন করুন।</p><label className="mt-7 block text-sm font-bold">নাম<input value={name} onChange={e=>setName(e.target.value)} required className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"/></label><button disabled={busy} className="mt-5 rounded-full bg-green-700 px-6 py-3 font-bold text-white disabled:opacity-60">{busy?"আপডেট হচ্ছে…":"Update Information"}</button></form></div>;
}
