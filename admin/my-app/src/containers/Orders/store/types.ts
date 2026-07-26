export type TOrderItem = {
  id: number;
  orderId: number;
  cakeName: string;
  weight: number;
  unitPrice: number;
  finalPrice: number;
  cakeId: number | null;
};

export type TOrder = {
  id: number;
  customerName: string;
  phone: string;
  deliveryType: "delivery" | "pickup";
  pickupPlace: string | null;
  address: string | null;
  deliveryDate: string;
  deliveryTime: string;
  totalPrice: number;
  deliveryMultiplier: number;
  status: "new" | "confirmed" | "completed" | "cancelled";
  source: string;
  createdAt: string;
  updatedAt: string;
  items: TOrderItem[];
};
