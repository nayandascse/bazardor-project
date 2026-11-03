import Link from "next/link";
export default function NotFound() {
  return <div className="container-main flex min-h-[55vh] flex-col items-center justify-center py-16 text-center"><div className="text-7xl">🧺</div><p className="mt-5 text-sm font-bold tracking-widest text-green-700">৪০৪ — পৃষ্ঠা পাওয়া যায়নি</p><h1 className="mt-3 text-3xl font-black">দুঃখিত, এখানে কিছু নেই!</h1><p className="mt-3 max-w-md text-gray-500">লিংকটি ভুল হতে পারে অথবা পৃষ্ঠাটি সরানো হয়েছে।</p><Link href="/" className="mt-7 rounded-full bg-green-700 px-6 py-3 font-bold text-white">হোম পেজে ফিরে যান</Link></div>;
}
