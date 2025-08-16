export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice?: number | string; // matches backend OrderItem.unitPrice
  product?: { id: number; name: string; price: number }; // populated product if available
}

export interface ProductWithOrderItem {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  stockQuantity?: number | null;
  OrderItem: {
    quantity: number;
    unitPrice: number | string;
  };
}

export interface Order {
  id?: number;
  userId?: number;
  status?: 'pending' | 'completed' | 'cancelled';
  totalAmount?: number | string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[]; // for form submission
  products?: ProductWithOrderItem[]; // backend populated products
  User?: { email: string; role: string }; // populated user
}
