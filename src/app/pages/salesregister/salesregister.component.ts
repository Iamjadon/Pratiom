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
import { jsPDF } from 'jspdf';


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

  showTable: boolean = false; 

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
    this.items.push({ ...this.newItem, partyName: this.partyName });

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
    this.showTable = true;
    this.calculateTotal();
  }

  printBill() {
    const doc = new jsPDF();
  
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Pratiom Jewellery", 105, 15, { align: "center" });
  
    // Party Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Customer Name: ${this.partyName}`, 10, 30);
    doc.text(`Address: ${this.address}`, 10, 40);
    doc.text(`Mobile: ${this.mobile}`, 10, 50);
    doc.text(`Email: ${this.email}`, 10, 60);
  
    // Invoice Details
    doc.text(`Invoice No: ${this.invoiceNo}`, 140, 30);
    doc.text(`Invoice Date: ${this.invoiceDate.toDateString()}`, 140, 40);
  
    // Items Table Header
    let startY = 70;
    doc.setFont("helvetica", "bold");
    doc.text("Items", 10, startY);
    startY += 10;
  
    doc.line(10, startY, 200, startY);
    startY += 5;
    doc.text("No.", 10, startY);
    doc.text("Item Name", 30, startY);
    doc.text("Quantity", 100, startY);
    doc.text("Price", 140, startY);
    doc.text("Total", 170, startY);
    startY += 5;
    doc.line(10, startY, 200, startY); 
    startY += 5;
  
    // Items Table Content
    this.items.forEach((item, index) => {
      const price = parseFloat(item.price) || 0; 
      const total = parseFloat(item.total) || 0;
    
      doc.text((index + 1).toString(), 10, startY);
      doc.text(item.name, 30, startY);
      doc.text(item.qty.toString(), 100, startY);
      doc.text(price.toFixed(2), 140, startY); 
      doc.text(total.toFixed(2), 170, startY);
    
      startY += 10;
    
      if (startY > 270) {
        doc.addPage();
        startY = 20;
      }
    });
    
  
    // Summary Section
    if (startY > 270) {
      doc.addPage();
      startY = 20;
    }
    startY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 10, startY);
    startY += 10;
  
    doc.setFont("helvetica", "normal");
    doc.text(`Total Bill: ${this.totalBill.toFixed(2)}`, 10, startY);
    doc.text(`SGST: ${this.sgst.toFixed(2)}`, 10, startY + 10);
    doc.text(`CGST: ${this.cgst.toFixed(2)}`, 10, startY + 20);
  
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", 105, 290, { align: "center" });
  
    // Open PDF in a new tab
    doc.output("dataurlnewwindow");
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
