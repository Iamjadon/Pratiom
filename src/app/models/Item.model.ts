export interface Item {
    type: string;
    name: string;
    qty: number;
    weight: number;
    price: number;
    discount: number;
    total?: number;  // Optional, calculated later
  }
  