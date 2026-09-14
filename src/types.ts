export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  isHot?: boolean;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  description: string;
  material: string;
  tags: string[];
}

export interface CartItem {
  id: string; // composite key: `${productId}-${size}-${color}`
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  selectedSizes: string[];
  selectedColors: string[];
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
  searchQuery: string;
}

export interface AuthUser {
  id: number | string;
  username: string;
  email: string;
  fullName?: string;
  token?: string;
}
