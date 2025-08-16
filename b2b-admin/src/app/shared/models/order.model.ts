export interface OrderItem {
  productId: number;
  quantity: number;
  price?: number;
  product?: { id: number; name: string; price: number }; // if backend includes populated product
}

export interface Order {
  id?: number;
  items: OrderItem[];
  createdAt?: string;
  userId?: number;
}
