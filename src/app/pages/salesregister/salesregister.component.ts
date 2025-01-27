import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

   constructor(private http: HttpClient){}
  

  karatPrice:number=1;
  emailInvalid: boolean = false;

  karatValuePrice = [
    { id: 1, karat: '18K', price: 75 },
    { id: 2, karat: '20K', price: 83.33 },
    { id: 3, karat: '22K', price: 91.66 },
    { id: 4, karat: '24K', price: 100 },
    { id: 5, karat: '0', price: 100 },
  ];


  validateEmail(event: any): void {
    const email = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailInvalid = !emailPattern.test(email);
    if (this.emailInvalid) {
      console.warn("Invalid email format");
    }
  }


  calculateKaratPrice() {
    const selectedKarat = this.karatValuePrice.find(
      (item) => item.karat === this.newItem.Karat
    );
  
    if (selectedKarat) {
      const currentGoldPricePerGram = 1000; 
      const karatPrice = selectedKarat.price;
      const netmetal = parseFloat((Number(this.newItem.netmetal) || 0).toFixed(2));
      const stone = Number(this.newItem.StoneAmt) || 0;
      const productPrice = ((currentGoldPricePerGram * karatPrice) / 100) * netmetal + stone;
      this.newItem.price = parseFloat(productPrice.toFixed(2)); 
      this.newItem.cgst = parseFloat((productPrice * 1.5 / 100).toFixed(2));
      this.newItem.sgst = parseFloat((productPrice * 1.5 / 100).toFixed(2));
      this.newItem.makingcharge = parseFloat((productPrice * 15 / 100).toFixed(2));
      this.newItem.total = parseFloat(
        (productPrice + this.newItem.cgst + this.newItem.sgst+this.newItem.makingcharge).toFixed(2)
      );
      this.karatPrice = this.newItem.price;
    } else {
      console.log('No Karat selected or invalid Karat.');
    }
  }
  
  showTable: boolean = false; 

  partyName: string = '';
  address: string = '';
  mobile: string = '';
  phone: string = '';
  email: string = '';
  invoiceNo: string = '#PR001';
  gstNo: string = 'GSTNO12345697';
  invoiceDate: Date = new Date();
  idType:string='';
  idNumber:string='';

  generateInvoiceNo() {
    if (this.partyName) {
      const firstLetter = this.partyName.charAt(0).toUpperCase();
      const randomNum = Math.floor(Math.random() * 10000); 
      this.invoiceNo = `#${firstLetter}${randomNum}PJ`;
    }
  }


  onPartyNameChange(event: any) {
    this.partyName = event.target.value;  
    this.generateInvoiceNo();  
  }
  resetItem() {
    this.newItem = {
      paymentType: '', 
      metalType: '',
      itemName: '',
      quantity: 0,
      totalWeight: 0,
      price: 0,
      discount: 0,
      total: 0,
      Karat: '',
      Stone: 0,
      StoneAmt: 0,
      netmetal: 0,
      totalvalue: 0,
      cgst: 0,
      sgst: 0,
      makingcharge: 0,
    };
  }
  

  newItem = {
    paymentType: '', 
    metalType: '',
    itemName: '',
    quantity: 0,
    totalWeight: 0,
    price: 0,
    discount: 0,
    total: 0,
    Karat: '',
    Stone: 0,
    StoneAmt: 0,
    netmetal: 0,
    totalvalue: 0,
    cgst:0,
    sgst:0,
    makingcharge:0

  };

  items: any[] = [];
  totalBill: number = 0;
  discount: number = 0;
  sgst: number = 1.5;
  cgst: number = 1.5;
  makingcharge:number=1.5;
  

  addItem() {
    if (!this.newItem.itemName || this.newItem.total <= 0) {
      const errorMessage = !this.newItem.itemName 
        ? 'Item Name cannot be empty. Please provide a valid item name.' 
        : `Total price must be greater than zero. Please check the item details.`;
      alert(errorMessage);
      return; 
    }
    if (!this.partyName || this.partyName.trim() === '') {
      alert('Please fill in the Party Name field.');
      document.getElementById('partyNameInput')?.focus();
      return;
    }
    const itemToAdd = {
      userId: 0,
      customerName: this.partyName,
      address: this.address || 'N/A',
      email: this.email || 'N/A',
      mobileNumber: this.mobile,
      idType: this.idType,
      idNumber: this.idNumber,
      pay: this.newItem.paymentType,
      invoiceNo: this.invoiceNo,
      invoiceDate: new Date().toISOString(),  
      gstNO: this.gstNo,
      metalType: this.newItem.metalType,
      itemName:  this.newItem.itemName,
      quantity:  this.newItem.quantity,
      karat: this.newItem.Karat,
      netmetal: this.newItem.netmetal,
      stone: this.newItem.Stone,
      totalWeight: this.newItem.totalWeight,
      productPrice: this.newItem.price,
      cgst: this.newItem.cgst,
      sgst: this.newItem.sgst,
      makingCharge: this.newItem.makingcharge,
      totalValue: this.newItem.total,
      Discount: Number(this.newItem.discount),
    };
      console.log('my data',itemToAdd);
      this.http.post('https://localhost:7088/api/Billing/AddBillingDetails', itemToAdd).subscribe({
    
        next: (response) => {
          console.log('Item added successfully:', response);
          console.log('Payload:', itemToAdd);
          // this.items.push(itemToAdd);
          // this.calculateTotal();
          this.resetItem();
        },
        error: (error) => {
          console.error('Error adding item:', error);
        }
      });
    
    
    this.items.push({ ...this.newItem });

    this.newItem = {
      paymentType: '', 
      metalType: '',
      itemName: '',
      quantity: 0,
      totalWeight: 0,
      price: 0,
      discount: 0,
      total: 0,
      Karat: '',
      Stone: 0,
      StoneAmt: 0,
      netmetal: 0,
      totalvalue: 0,
      cgst:0,
      sgst:0,
      makingcharge:0,
    };
    
    this.showTable = true;
    this.calculateTotal();
  }


  updatenetmetal(): void {
    const totalWeight = Number(this.newItem.totalWeight) || 0;
    const stone = Number(this.newItem.Stone) || 0;
    this.newItem.netmetal = parseFloat((totalWeight - stone).toFixed(2));
  }


  calculateTotal() {
    this.totalBill = 0;

    this.items.forEach((item) => {
      item.total = item.price - item.discount;
      item.total+=item.cgst;
      item.total+=item.sgst;
      item.total+=item.makingcharge;

      // this.totalBill += item.total;
    });
  }

printBill() {
  const doc = new jsPDF({ format: 'letter', unit: 'mm', orientation: 'portrait' });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  const marginLeft = 10;
  const marginRight = 10;
  const tableWidth = pageWidth - marginLeft - marginRight;

  // Generate a more descriptive file name
  const fileName = `Invoice_${this.invoiceNo}_${this.partyName.replace(/\s+/g, '_')}.pdf`;

  // Header Section with company details
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Pratiom Jewellery", pageWidth / 2, 20, { align: "center" });

  // Party Details Section (Formatted)
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const partyDetails = [
    `Customer Name: ${this.partyName || 'N/A'}`,
    `Address: ${this.address || 'N/A'}`,
    `Mobile: ${this.mobile || 'N/A'}`,
    `Pay Mode: ${this.newItem.paymentType || 'N/A'}`,
    `GST Number: ${this.gstNo || 'N/A'}`,
    `ID: ${this.idNumber || 'N/A'}`,
    `Invoice Date: ${this.invoiceDate ? this.invoiceDate.toDateString() : 'N/A'}`
  ];

  let yPosition = 40;
  partyDetails.forEach(detail => {
    doc.text(detail, marginLeft, yPosition);
    yPosition += 10;
  });

  // Invoice Details Section (Right-aligned)
  doc.text(`Invoice No: ${this.invoiceNo || 'N/A'}`, pageWidth - 100, yPosition, { align: "right" });
  yPosition += 10;

  // Items Table Header with SGST, CGST, and Making Charge columns
  doc.setFont("helvetica", "bold");
  yPosition += 10;
  doc.text("Items", marginLeft, yPosition);
  yPosition += 10;

  doc.setLineWidth(0.5);
  doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition); // Horizontal line for header
  yPosition += 5;

  // Adjusted Table headers
  doc.text("Item No.", marginLeft, yPosition);
  doc.text("Item Name", marginLeft + 20, yPosition);
  doc.text("Product Price", marginLeft + 60, yPosition); // Increased space for product price
  doc.text("Making Charge", marginLeft + 100, yPosition); // Adjusted position
  doc.text("SGST", marginLeft + 140, yPosition); // Adjusted position
  doc.text("CGST", marginLeft + 170, yPosition); // Adjusted position
  doc.text("Discount", marginLeft + 200, yPosition); // Adjusted position
  doc.text("Total", marginLeft + 230, yPosition); // Adjusted position
  yPosition += 5;

  doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition); // Horizontal line under headers
  yPosition += 5;

  // Items Table Content with Safe Checks
  let total = 0;
  this.items.forEach((item, index) => {
    const price = parseFloat(item.price) || 0;
    const sgst = parseFloat(item.sgst) || 0;
    const cgst = parseFloat(item.cgst) || 0;
    const makingCharge = parseFloat(item.makingcharge) || 0;
    const itemTotal = parseFloat(item.total) || 0;
    total += itemTotal;
    const qty = item.qty || 0;
    const itemName = item.itemName || 'Unknown Item';

    // Ensure discount is a number before calling toFixed
    const discount = parseFloat(item.discount) || 0;  // Safeguard for discount
    const itemDiscount = discount.toFixed(2);

    // Print item details
    doc.text((index + 1).toString(), marginLeft, yPosition);
    doc.text(itemName, marginLeft + 20, yPosition);
    doc.text(price.toFixed(2), marginLeft + 60, yPosition);  // Adjusted position
    doc.text(makingCharge.toFixed(2), marginLeft + 100, yPosition); // Adjusted position
    doc.text(sgst.toFixed(2), marginLeft + 140, yPosition); // Adjusted position
    doc.text(cgst.toFixed(2), marginLeft + 170, yPosition); // Adjusted position
    doc.text(itemDiscount, marginLeft + 200, yPosition); // Adjusted position
    doc.text(itemTotal.toFixed(2), marginLeft + 230, yPosition); // Adjusted position

    yPosition += 10;

    // Add a new page if the content exceeds the page height
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Summary Section
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }
  yPosition += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Summary", marginLeft, yPosition);
  yPosition += 10;

  doc.setFont("helvetica", "normal");
  doc.text(`Total: ${total.toFixed(2)}`, marginLeft, yPosition);
  yPosition += 10;
  doc.text(`SGST: ${this.sgst.toFixed(2)}`, marginLeft, yPosition);
  yPosition += 10;
  doc.text(`CGST: ${this.cgst.toFixed(2)}`, marginLeft, yPosition);
  yPosition += 10;
  doc.text(`Discount: ${this.newItem.discount.toFixed(2)}`, marginLeft, yPosition);
  yPosition += 10;
  doc.text(`Grand Total: ${(total + this.sgst + this.cgst + this.newItem.discount).toFixed(2)}`, marginLeft, yPosition);

  // Footer Section with company info
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 10, { align: "center" });

  // Open the print dialog without opening a new tab (directly in the current window)
  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
}

  

  
}
