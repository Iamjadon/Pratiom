import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-salesregister',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './salesregister.component.html',
  styleUrls: ['./salesregister.component.css'],
})
export class SalesregisterComponent {
  partyName: string = '';
  address: string = '';
  mobile: string = '';
  phone: string = '';
  email: string = '';
  invoiceNo: string = '#PR001';
  gstNo: string = '';
  invoiceDate: Date = new Date();

  newItem = {
    type: '',
    name: '',
    qty: 0,
    weight: 0,
    price: 0,
    discount: 0,
    total: 0,
    Karat: '',
    Stone: 0,
    StoneAmt: 0,
    NetMetal: 0,
    totalvalue: 0,
  };

  items: any[] = [];
  totalBill: number = 0;
  discount: number = 0;
  sgst: number = 0;
  cgst: number = 0;

  addItem() {
    this.items.push({ ...this.newItem });

    this.newItem = {
      type: '',
      name: '',
      qty: 0,
      weight: 0,
      price: 0,
      discount: 0,
      total: 0,
      Karat: '',
      Stone: 0,
      StoneAmt: 0,
      NetMetal: 0,
      totalvalue: 0,
    };

    this.calculateTotal();
  }

  calculateTotal() {
    this.totalBill = 0;
    this.discount = 0;
    this.sgst = 0;
    this.cgst = 0;

    this.items.forEach((item) => {
      item.total = item.qty * item.price - item.discount;
      item.sgst = item.total * 1.5;
      item.cgst = item.total * 1.5;
      this.totalBill += item.total + item.sgst + item.cgst;
    });
  }
}
