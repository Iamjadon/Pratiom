import { Item } from './Item.model';
import { Party } from './party.model';

export interface Invoice {
  invoiceNo: string;
  invoiceDate: Date;
  party: Party;
  items: Item[];
  totalBill: number;
  discount: number;
  sgst: number;
  cgst: number;
}
