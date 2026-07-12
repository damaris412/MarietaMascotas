export type ProductSize = "S" | "M" | "L";

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
};

export type ProductDTO = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: CategoryDTO;
  price: number;
  previousPrice: number | null;
  images: string[];
  stock: number;
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  active: boolean;
};

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string | null;
  size: ProductSize | null;
  quantity: number;
  maxStock: number;
};
