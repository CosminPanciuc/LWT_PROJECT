export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';
export type ProductCategory = 'ELECTRONICS' | 'FASHION' | 'HOME' | 'BOOKS' | 'SPORTS' | 'OTHER';
export type ProductCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
export type ProductStatus = 'ACTIVE' | 'SOLD' | 'INACTIVE';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  status: ProductStatus;
  images: string[];
  stock: number;
  seller: User;
  reviews: Review[];
  averageRating?: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  buyer: User;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  product: Product;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  images: string[];
  stock: number;
}

export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  sellerId?: string;
  search?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}
