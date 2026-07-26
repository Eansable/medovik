export type TCake = {
  id: number;
  name: string;
  image: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  prices: { weight: number; price: number }[];
};
