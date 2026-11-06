import type { Metadata } from "next";
import type { Product, Category } from "@/types/product";

import "./globals.css";

import ToastProvider from "@/components/ToastProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "বাজার দর — নিত্যপণ্যের আজকের দাম",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন।",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    const [categoryData, productData] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);

    categories = categoryData;
    products = productData;
  } catch (error) {
    console.error("Failed to load layout data:", error);
  }

  return (
    <html lang="bn">
      <body>
        <Navbar categories={categories} products={products} />

        <main className="min-h-[60vh]">{children}</main>

        <Footer />

        <ToastProvider />
      </body>
    </html>
  );
}