"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  useEffect(()=>{ if(!isPending && !session?.user){ toast.error("প্রোফাইল দেখতে সাইন ইন করুন"); router.replace("/signin?callbackURL=%2Fprofile"); } },[isPending,session,router]);
  if(isPending || !session?.user) return <div className="container-main py-20"><div className="skeleton mx-auto h-64 max-w-xl rounded-3xl"/></div>;
  return <div className="container-main py-16"><div className="mx-auto max-w-2xl rounded-3xl border border-green-100 bg-white p-8 sm:p-10"><div className="text-5xl">👤</div><h1 className="mt-4 text-3xl font-black">আমার প্রোফাইল</h1><div className="mt-7 space-y-3"><p className="rounded-xl bg-gray-50 p-4"><span className="text-sm text-gray-500">নাম</span><strong className="mt-1 block">{session.user.name}</strong></p><p className="rounded-xl bg-gray-50 p-4"><span className="text-sm text-gray-500">ইমেইল</span><strong className="mt-1 block">{session.user.email}</strong></p></div><Link href="/profile/update" className="mt-6 inline-flex rounded-full bg-green-700 px-6 py-3 font-bold text-white">তথ্য আপডেট করুন</Link></div></div>;
}
