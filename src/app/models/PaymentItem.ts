export class PaymentItem {
  type: string;
  name: string;
  qty: number;
  weight: number;
  price: number;
  discount: number;
  sgst: number;
  cgst: number;
  totalValue: number;

  constructor() {
    this.type = '';
    this.name = '';
    this.qty = 0;
    this.weight = 0;
    this.price = 0;
    this.discount = 0;
    this.sgst = 0;
    this.cgst = 0;
    this.totalValue = 0;
  }
}
