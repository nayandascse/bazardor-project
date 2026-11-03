export type MarketPrice = {
  bazar?: string;
  market?: string;
  name?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  price?: number | string;
  averagePrice?: number | string;
  unit?: string;
};

export type Product = {
  id: string | number;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  unit: string;
  emoji: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  change: number;
  markets: MarketPrice[];
};

export type Category = {
  id: string | number;
  name: string;
  slug: string;
  icon: string;
};
