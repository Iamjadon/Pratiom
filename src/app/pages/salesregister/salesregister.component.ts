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
import { Item } from '../../models/Item.model';

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
  invoiceNo: string = '#PR001';
  invoiceDate: Date = new Date();

  newItem: Item = {
    type: '',
    name: '',
    qty: 0,
    weight: 0,
    price: 0,
    discount: 0,
  };

  items: Item[] = [];
  totalBill: number = 0;
  discount: number = 0;
  sgst: number = 0;
  cgst: number = 0;

  addItem() {
    const calculatedTotal = (this.newItem.qty * this.newItem.price) - this.newItem.discount;
    this.items.push({ ...this.newItem, total: calculatedTotal });

    this.newItem = {
      type: '',
      name: '',
      qty: 0,
      weight: 0,
      price: 0,
      discount: 0,
    };

    this.calculateTotal();
  }

  calculateTotal() {
    this.totalBill = 0;
    this.discount = 0;
    this.sgst = 0;
    this.cgst = 0;

    this.items.forEach(item => {
      this.totalBill += item.total || 0;
      this.sgst += item.total ? item.total * 0.09 : 0;
      this.cgst += item.total ? item.total * 0.09 : 0;
    });
  }
}