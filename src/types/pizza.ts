
export interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  prices: {
    P: number;
    M: number;
    G: number;
    GG: number;
    "EX GG": number;
  };
  ingredients: string[];
}

export interface CartItem {
  pizza: Pizza;
  size: keyof Pizza['prices'];
  quantity: number;
  price: number;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  deliveryType: 'delivery' | 'pickup';
}

export type PizzaSize = 'P' | 'M' | 'G' | 'GG' | 'EX GG';
