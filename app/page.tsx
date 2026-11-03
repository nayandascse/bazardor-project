import HomeClient from "@/components/HomeClient";
import { getProducts } from "@/lib/api";
export const revalidate = 300;
export default async function HomePage() {
  const products = await getProducts();
  return <HomeClient initialProducts={products}/>;
}
