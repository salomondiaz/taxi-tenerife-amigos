
export type PaymentMethod = {
  id: string;
  type: "card" | "cash" | "paypal" | "bizum";
  name: string;
  last4?: string;
  expiry?: string;
  default?: boolean;
  // Campo para el cambio en efectivo
  changeBalance?: number;
};
