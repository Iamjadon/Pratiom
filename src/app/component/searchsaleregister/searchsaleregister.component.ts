import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import jsPDF from 'jspdf';

interface Invoice {
  invoiceNo: string;
  customerName: string;
  address: string;
  email: string;
  mobileNumber: string;
  invoiceDate: string;
  gstNo: string;
  payType: string;
  invoices: BillingItem[];
}

interface BillingItem {
  invoiceId: number;
  metalType: string;
  itemName: string;
  quantity: number;
  karatType: string;
  totalWeight: number;
  stone: string;
  stoneAmount: number;
  netMetal: number;
  productPrice: number;
  discount: number;
  sgst: number;
  cgst: number;
  makingCharge: number;
  totalValue: number;
}

interface PaymentSplit {
  paymentType: string;
  money: number;
}

@Component({
  selector: 'app-searchsaleregister',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './searchsaleregister.component.html',
  styleUrls: ['./searchsaleregister.component.css']
})
export class SearchsaleregisterComponent {
  invoiceNumber: string = '';
  invoiceData: Invoice | null = null;
  invoiceItems: BillingItem[] = [];
  paymentSplits: PaymentSplit[] = [];

  constructor(private http: HttpClient) {}

  searchInvoice() {
    if (!this.invoiceNumber.trim()) {
      alert("Please enter a valid invoice number.");
      return;
    }
  
    const encodedInvoiceNo = encodeURIComponent(this.invoiceNumber);
    const invoiceUrl = `https://localhost:7088/api/Billing/search?invoiceNo=${encodedInvoiceNo}`;
    const paymentUrl = `https://localhost:7088/api/PaymentSplit/search?invoiceNo=${encodedInvoiceNo}`;
  
    this.http.get<Invoice[]>(invoiceUrl).subscribe(
      (data) => {
        if (data.length === 0) {
          alert("No records found for this invoice.");
          return;
        }
  
        this.invoiceData = data[0];
        this.invoiceItems = data[0].invoices;
  
        this.http.get<PaymentSplit[]>(paymentUrl).subscribe(
          (paymentData) => {
            this.paymentSplits = paymentData;
            this.printBill(); 
          },
          (paymentError: HttpErrorResponse) => {
            console.error("Error fetching payment splits:", paymentError);
            this.paymentSplits = [];  
            this.printBill();  
          }
        );
      },
      (error: HttpErrorResponse) => {
        console.error("Error fetching invoice details:", error);
        alert("Failed to fetch invoice details. Please try again.");
      }
    );
  }

 
  printBill() {
    if (!this.invoiceData) {
      alert("No invoice data available to print.");
      return;
    }
  
    const doc = new jsPDF({
      format: 'letter',
      unit: 'mm',
      orientation: 'portrait'
    });
  
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    let yPosition = 15;
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Pratiom Jewellery", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
  
    const details = [
      `Customer: ${this.invoiceData.customerName || 'N/A'}`,
      `Address: ${this.invoiceData.address || 'N/A'}`,
      `Mobile: ${this.invoiceData.mobileNumber || 'N/A'}`,
      `Invoice No: ${this.invoiceData.invoiceNo || 'N/A'}`,
      `Invoice Date: ${new Date(this.invoiceData.invoiceDate).toLocaleDateString()}`
    ];
  
    details.forEach(detail => {
      doc.text(detail, margin, yPosition);
      yPosition += 6;
    });
  
    yPosition += 8;
  
    doc.setFont("helvetica", "bold");
    doc.setFillColor(230, 230, 250);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
  
    const columns = ["No", "Item", "Price", "Making", "SGST", "CGST", "Discount", "Total"];
    const colWidths = [10, 45, 20, 20, 15, 15, 20, 25];
    let xPos = margin;
  
    columns.forEach((col, i) => {
      doc.text(col, xPos + 2, yPosition + 5);
      xPos += colWidths[i];
    });
  
    yPosition += 8;
  
    // Table Rows
    doc.setFont("helvetica", "normal");
    this.invoiceItems.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 6, 'F');
      }
  
      xPos = margin;
      const rowData = [
        (index + 1).toString(),
        item.itemName || "N/A",
        item.productPrice.toFixed(2),
        item.makingCharge.toFixed(2),
        item.sgst.toFixed(2),
        item.cgst.toFixed(2),
        item.discount.toFixed(2),
        (item.totalValue - item.discount).toFixed(2)
      ];
  
      rowData.forEach((data, i) => {
        doc.text(data, xPos + 2, yPosition + 5);
        xPos += colWidths[i];
      });
  
      yPosition += 6;
    });
  
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    yPosition += 8;
  
    if (this.paymentSplits && this.paymentSplits.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFillColor(230, 230, 250);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      doc.text("Payment Breakdown", margin + 2, yPosition + 5);
      yPosition += 8;
  
      doc.setFont("helvetica", "normal");
      this.paymentSplits.forEach((payment, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, yPosition, pageWidth - 2 * margin, 6, 'F');
        }
  
        doc.text(`${index + 1}. ${payment.paymentType}: ₹${payment.money.toFixed(2)}`, margin + 2, yPosition + 5);
        yPosition += 6;
      });
  
      yPosition += 10;
    }
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 10, { align: "center" });
  
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }
  
  
}
