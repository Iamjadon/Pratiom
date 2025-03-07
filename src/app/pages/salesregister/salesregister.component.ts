import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { jsPDF } from 'jspdf';


import { ApiService } from '../../services/api-service';
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
    MatIconModule,
    FontAwesomeModule
  ],
  templateUrl: './salesregister.component.html',
  styleUrls: ['./salesregister.component.css'],
})
export class SalesregisterComponent {
  trashIcon = faTrash;
  totalAmountInBill: number = 0;
  isPaymentModalOpen: boolean = false;
  paymentMode: string = 'full_cash';  
  amount: number = 0;
  totalPaymentAmount: number = 0;
  pendingAmount: number = 0;
  currentGoldPricePerGram: number = 0;
  currentSilverPricePerGram: number = 0;
  karatPrice:number=1;
  emailInvalid: boolean = false;

  

  constructor(private http: HttpClient,private apiService: ApiService){}


  karatValuePrice = [
    { id: 1, karat: '18K', price: 75 },
    { id: 2, karat: '20K', price: 83.33 },
    { id: 3, karat: '22K', price: 91.66 },
    { id: 4, karat: '24K', price: 100 },
    { id: 5, karat: '0', price: 100 },
  ];


  ngOnInit(): void {
    this.fetchGoldPrice();
    this.generateInvoiceNo();
    // this.formatInvoiceDate();
  }

  openPaymentModal() {
    this.isPaymentModalOpen = true;  
  }

  splitBill() {
    this.isPaymentModalOpen = true;
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false; 
  }
  trackByIndex(index: number, item: any): any {
    return index;  
  }
  

  saveAmount() {
    const amount = this.amount; 
    const key = this.paymentMode; 
    const totalAmount = this.totalAmountInBill; 
    if (isNaN(amount) || amount <= 0) {
      console.log('Invalid amount');
      return;
    }
    this.totalPaymentAmount += amount; 

    if (this.totalPaymentAmount> totalAmount) {
      alert("Payment cannot be greater than the total item amount.");
      return; 
    }
    this.pendingAmount = totalAmount - this.totalPaymentAmount;


    const paymentData = {
      invoiceNo: this.invoiceNo,
      paymentType: key,
      money: this.amount,
    };

    // Call API to Save Data
    this.apiService.splitPayment(paymentData).subscribe({
      next: (response) => {
        console.log('Payment saved successfully:', response);
        alert('Payment saved successfully!');
      },
      error: (error) => {
        console.error('Error saving payment:', error);
        alert('Failed to save payment.');
      },
    });

    this.amount = 0;  
  }
  
  fetchGoldPrice() {
    this.apiService.getGoldAndSilverPrice().subscribe({
      next: (response) => {
        if (response && response.todayGoldPrice) {
          this.currentGoldPricePerGram = response.todayGoldPrice / 10; 
          this.currentSilverPricePerGram=response.todaySilverPrice / 10;
          console.log('Fetched current gold price per gram:', this.currentGoldPricePerGram);
        }
      },
      error: (error) => {
        console.error('Error fetching gold price:', error);
      }
    });
  }
  
  validateEmail(event: any): void {
    const email = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailInvalid = !emailPattern.test(email);
    if (this.emailInvalid) {
      console.warn("Invalid email format");
    }
  }

  onMetalTypeChange() {
    if (this.newItem.metalType === 'silver') {
      this.newItem.karatType = '24K';  
      this.calculateKaratPrice();  
    }
  }
  
  calculateKaratPrice() {
    const selectedKarat = this.karatValuePrice.find(
      (item) => item.karat === this.newItem.karatType
    );
  
    if (selectedKarat) {
      const karatPrice = selectedKarat.price;
      const netMetal = parseFloat((Number(this.newItem.netMetal) || 0).toFixed(2));
      const stone = Number(this.newItem.stoneAmount) || 0;
  
      let productPrice = 0;
  
      if (this.newItem.metalType === 'silver') {
        this.newItem.karatType = '24K'; 
        productPrice = (this.currentSilverPricePerGram * netMetal) + stone;
      } else {
        productPrice = ((this.currentGoldPricePerGram * karatPrice) / 100) * netMetal + stone;
      }
  
      this.newItem.productPrice = parseFloat(productPrice.toFixed(2));
      this.newItem.cgst = parseFloat((productPrice * 1.5 / 100).toFixed(2));
      this.newItem.sgst = parseFloat((productPrice * 1.5 / 100).toFixed(2));
      this.newItem.makingCharge = parseFloat((productPrice * 15 / 100).toFixed(2));
  
      this.newItem.total = parseFloat(
        (productPrice + this.newItem.cgst + this.newItem.sgst + this.newItem.makingCharge).toFixed(2)
      );
  
      this.karatPrice = this.newItem.productPrice;
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
  invoiceNo: string = '';
  gstNo: string = '';
  invoiceDate: Date = new Date();
  idType:string='';
  idNumber:string='';
  paymentType:string='';

  formattedInvoiceDate: string = '';  


// formatInvoiceDate() {
//   const day = this.invoiceDate.getDate(); 
//   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const month = monthNames[this.invoiceDate.getMonth()];
// const year = this.invoiceDate.getFullYear();

// // Store formatted string separately
// this.formattedInvoiceDate = `${day} ${month} ${year}`;
// this.invoiceDate = new Date(year, this.invoiceDate.getMonth(), day);

// console.log('Formatted:', this.formattedInvoiceDate); 
// console.log('Date object:', this.invoiceDate);

// }



  generateInvoiceNo() {
    this.apiService.getLastInvoiceNumber().subscribe({
      next: (response) => {
        console.log('API Response:', response);  
        if (response && response.lastInvoiceNumber) {
          console.log('Last Invoice No from API:', response.lastInvoiceNumber); 
          const match = response.lastInvoiceNumber.match(/#PR(\d+)/);
          
          if (match) {
            const lastNumber = parseInt(match[1], 10);
            console.log('Last number extracted:', lastNumber); 
  
            const newNumber = (lastNumber + 1).toString().padStart(3, '0');
            console.log('New invoice number:', `#PR${newNumber}`); 
  
            this.invoiceNo = `#PR${newNumber}`;
          } else {
            console.warn('Invoice number format is incorrect, falling back to #PR001');
            this.invoiceNo = "#PR001";
          }
        } else {
          console.warn('No invoice number found in API response, initializing as #PR001');
          this.invoiceNo = "#PR001";
        }
      },
      error: (error) => {
        console.error('Error fetching last invoice number:', error);
        this.invoiceNo = "#PR001"; 
      }
    });
  }
  

  onPartyNameChange(event: any) {
    this.partyName = event.target.value;  
  }
  resetItem() {
    this.newItem = {
      metalType: '',
      itemName: '',
      quantity: 0,
      totalWeight: 0,
      productPrice: 0,
      discount: 0,
      total: 0,
      karatType: '',
      stoneType: 0,
      stoneAmount: 0,
      netMetal: 0,
      totalvalue: 0,
      cgst: 0,
      sgst: 0,
      makingCharge: 0,
    };
  }
  


  newItem = {

    metalType: '',
    itemName: '',
    quantity: 0,
    totalWeight: 0,
    productPrice: 0,
    discount: 0,
    total: 0,
    karatType: '',
    stoneType: 0,
    stoneAmount: 0,
    netMetal: 0,
    totalvalue: 0,
    cgst:0,
    sgst:0,
    makingCharge:0,
  };

  items: any[] = [];

  totalBill: number = 0;
  
  addItem() {
    if (!this.validateItem()) return;

    const itemToAdd = { 
      ...this.newItem,
      invoiceNo: this.invoiceNo,
      customerName: this.partyName,
      mobileNumber: this.mobile
    };

    this.items.push(itemToAdd);
    this.showTable = true;
    this.calculateTotal();
    this.resetItem();
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
    this.calculateTotal();
    if (this.items.length === 0) this.showTable = false;
  }

  submitInvoice() {

    const invoiceData = {
      userId: 0,
      invoiceNo: this.invoiceNo,  
      customerName: this.partyName,  
      address: this.address,
      email: this.email,
      mobileNumber: this.mobile, 
      idType: this.idType,
      idNumber: this.idNumber,
      payType: this.paymentType, 
      invoiceDate: this.invoiceDate ? this.invoiceDate.toISOString() : new Date().toISOString(),  // Ensures valid date
      gstNo: this.gstNo,  
  
      invoices: this.items.map(item => ({
        invoiceId: 0,  
        invoiceNo: this.invoiceNo,  
        metalType: item.metalType,
        itemName: item.itemName,
        quantity: item.quantity || 0, 
        karatType: item.karatType,  
        totalWeight: item.totalWeight || 0,  
        stone: String(item.stoneType || ""),  
        stoneAmount: item.stoneAmount || 0,  
        netMetal: item.netMetal || 0,  
        productPrice: item.productPrice || 0,  
        discount: Number(item.discount) || 0,  
        sgst: item.sgst || 0,  
        cgst: item.cgst || 0,  
        makingCharge: item.makingCharge || 0,  
        totalValue: item.total ?? 0  
      }))
    
    };
    
    this.apiService.createInvoice(invoiceData).subscribe({
      next: (response) => {
        alert('Invoice created successfully!');
        // this.printBill();
        this.resetForm();
        this.generateInvoiceNo();
      },
      error: (error) => {
        console.error('Error creating invoice:', error);
        alert('Error creating invoice');
      }
    });
    // this.printBill();
    
  }

  private validateForm(): boolean {
    if (!this.partyName || !this.mobile || !this.invoiceNo) {
      alert('Please fill all required customer details');
      return false;
    }
    return true;
  }

  private validateItem(): boolean {
    if (!this.newItem.itemName || this.newItem.total <= 0) {
      alert('Item Name and Valid Total Price are required');
      return false;
    }
    return true;
  }

  private resetForm() {
    this.partyName = '';
    this.address = '';
    this.mobile = '';
    this.email = '';
    this.gstNo = '';
    this.idType = '';
    this.idNumber = '';
    this.paymentType = '';
    this.items = [];
    this.resetItem();
    this.showTable = false;
  }


  updatenetMetal(): void {
    const totalWeight = Number(this.newItem.totalWeight) || 0;
    const stone = Number(this.newItem.stoneType) || 0;
    this.newItem.netMetal = parseFloat((totalWeight - stone).toFixed(2));
  }

  calculateTotal() {
    this.totalBill = 0;
    this.totalAmountInBill = 0; 
  
    this.items.forEach((item) => {
      item.total = parseFloat((item.productPrice - item.discount).toFixed(2));
      item.total += parseFloat(item.cgst.toFixed(2));
      item.total += parseFloat(item.sgst.toFixed(2));
      item.total += parseFloat(item.makingCharge.toFixed(2));
  
      item.total = parseFloat(item.total.toFixed(2)); 
      this.totalAmountInBill += item.total;
    });
  
    this.totalAmountInBill = parseFloat(this.totalAmountInBill.toFixed(2)); 
  }
  
  onEnterPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.fetchCustomerDetails(); 
    }
  }

  fetchCustomerDetails() {
    if (!this.mobile || this.mobile.length !== 10) {
      return;
    }
  
    const apiUrl = `https://localhost:7088/api/CustomerDetails/SearchMobile?mobileNumber=${this.mobile}`;
    console.log('My url details',apiUrl);
    this.apiService.fetchCustomerDetails(this.mobile).subscribe({
      next: (response) => {
        if (response.customerDetails) {
          const customer = response.customerDetails;
          console.log('My customer details',customer);
          // Auto-fill form fields with fetched data
          // this.invoiceNo = customer.invoiceNo || '';
          this.partyName = customer.customerName || '';
          this.address = customer.address || '';
          this.email = customer.email || '';
          this.mobile = customer.mobileNumber || '';
          this.idType = customer.idType || '';
          this.idNumber = customer.idNumber || '';
          this.gstNo = customer.gstNo || '';
          // this.invoiceDate = customer.invoiceDate ? new Date(customer.invoiceDate) : new Date();
        } else {
          console.warn('No customer details found for this mobile number');
        }
      },
      error: (error) => {
        console.error('Error fetching customer details:', error);
      }
    });
  }
  
  printBill() { 
    this.apiService.getsplitPayment().subscribe(paymentSplits => {
      const doc = new jsPDF({ 
        format: 'letter', 
        unit: 'mm', 
        orientation: 'portrait' 
      });
  
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;
      let yPosition = 20;
  
      // Header Styling (Reduced Font Size)
      doc.setFont("times", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 128); // Navy blue
      doc.text("Pratiom Jewellery", pageWidth / 2, yPosition, { align: "center" });
  
      yPosition += 8;
  
      // Address Styling
      doc.setFont("courier", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Shop No. 12, Gold Market, Mumbai", pageWidth / 2, yPosition, { align: "center" });
  
      yPosition += 12;
  
      // Customer Details (Improved UI)
      doc.setFont("helvetica", "bold");
      const details = [
        `Name : ${this.partyName || 'N/A'}`,
        `Address: ${this.address || 'N/A'}`,
        `Mobile: ${this.mobile || 'N/A'}`,
        `Invoice Number: ${this.invoiceNo || 'N/A'}`
      ];
  
      details.forEach((detail, index) => {
        doc.text(detail, margin, yPosition + (index * 6));
      });
  
      yPosition += 30;


      const availableWidth = pageWidth - 2 * margin;
      const columns = [
        { header: 'No', width: 15, align: 'left' },
        { header: 'Item', width: 35, align: 'left' }, 
        { header: 'Price', width: 30, align: 'right' },
        { header: 'Making', width: 30, align: 'right' },
        { header: 'SGST', width: 20, align: 'right' },
        { header: 'CGST', width: 20, align: 'right' },
        { header: 'Discount', width: 20, align: 'right' }, 
        { header: 'Total', width: 30, align: 'right' } 
      ];
  
      const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
  
      const drawHeader = () => {
        doc.setFont("helvetica", "bold");
        doc.setFillColor(220, 220, 220);
        doc.rect(margin, yPosition, totalWidth, 8, 'F');
        let x = margin;
        columns.forEach(col => {
          doc.text(col.header, x + 2, yPosition + 5);
          x += col.width;
        });
        yPosition += 10;
      };
      
  
      drawHeader();
      doc.setFontSize(8);

      this.items.forEach((item, index) => {
        if (yPosition + 10 > pageHeight - margin) {
          doc.addPage();
          yPosition = 20;
          drawHeader();
        }
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, yPosition, totalWidth, 8, 'F');
        }
        const rowData = [
          (index + 1).toString(),
          item.itemName?.substring(0, 30) || 'N/A', 
          parseFloat(item.productPrice).toFixed(2),
          parseFloat(item.makingCharge).toFixed(2),
          parseFloat(item.sgst).toFixed(2),
          parseFloat(item.cgst).toFixed(2),
          parseFloat(item.discount).toFixed(2),
          (parseFloat(item.total) - parseFloat(item.discount)).toFixed(2)
        ];
        let x = margin;
        rowData.forEach((text, colIndex) => {
          doc.text(text, x + 2, yPosition + 5);
          x += columns[colIndex].width;
        });
        yPosition += 10;
      });
      
      yPosition += 10;
  
      doc.setFont("times", "bold");
      doc.setFontSize(10);
      const summaryData = [
        { label: 'Subtotal:', value: this.items.reduce((a, b) => a + parseFloat(b.total), 0).toFixed(2) },
        { label: 'Total SGST:', value: this.items.reduce((a, b) => a + parseFloat(b.sgst), 0).toFixed(2) },
        { label: 'Total CGST:', value: this.items.reduce((a, b) => a + parseFloat(b.cgst), 0).toFixed(2) },
        { label: 'Total Making:', value: this.items.reduce((a, b) => a + parseFloat(b.makingCharge), 0).toFixed(2) },
        { label: 'Total Discount:', value: this.items.reduce((a, b) => a + parseFloat(b.discount), 0).toFixed(2) },
        { label: 'Grand Total:', value: this.items.reduce((a, b) => a + parseFloat(b.total) + parseFloat(b.sgst) + parseFloat(b.cgst) + parseFloat(b.makingCharge) - parseFloat(b.discount), 0).toFixed(2) }
      ];
  
      summaryData.forEach(row => {
        doc.text(row.label, margin, yPosition);
        if (row.label === 'Grand Total:') {
          doc.setTextColor(255, 0, 0);
        }
        doc.text(row.value, pageWidth - margin, yPosition, { align: "right" });
        doc.setTextColor(0, 0, 0);
        yPosition += 6;
      });
  
      yPosition += 10;
  
      const relevantPayments = paymentSplits?.filter((p: any) => p.invoiceNo === this.invoiceNo);
      if (relevantPayments && relevantPayments.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFillColor(200, 230, 255);
        doc.rect(margin, yPosition, totalWidth, 8, 'F');
        doc.setTextColor(0, 0, 0);
        doc.text("Payment Method", margin + 2, yPosition + 5);
        doc.text("Amount", pageWidth - margin - 40, yPosition + 5, { align: "right" });
  
        yPosition += 10;
        doc.setFont("helvetica", "normal");
  
        relevantPayments.forEach((p: any, index: number) => {
          if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(margin, yPosition, totalWidth, 8, 'F');
          }
          doc.text(p.paymentType.charAt(0).toUpperCase() + p.paymentType.slice(1), margin + 2, yPosition + 5);
          doc.text(p.money.toFixed(2), pageWidth - margin - 2, yPosition + 5, { align: "right" });
          yPosition += 8;
        });
      }
      doc.setTextColor(0, 0, 0);
  
      // Footer
      yPosition += 10;
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text("1. Please retain this invoice for warranty.", margin, yPosition);
      doc.text("2. No refunds or exchanges allowed.", margin, yPosition + 5);
      doc.text("3. For support, contact +91-1234567890.", margin, yPosition + 10);
  
      doc.setFontSize(10);
      doc.text("Thank you for shopping with us!", pageWidth / 2, pageHeight - 15, { align: "center" });
  
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    }, error => {
      console.error('Error fetching payment splits:', error);
    });
  }

}
