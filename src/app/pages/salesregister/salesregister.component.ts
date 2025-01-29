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
    MatIconModule
  ],
  templateUrl: './salesregister.component.html',
  styleUrls: ['./salesregister.component.css'],
})
export class SalesregisterComponent {

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
  }

  openPaymentModal() {
    this.isPaymentModalOpen = true;  
  }

  spilitBill() {
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
      this.newItem.Karat = '24K';  
      this.calculateKaratPrice();  
    }
  }
  
  calculateKaratPrice() {
    const selectedKarat = this.karatValuePrice.find(
      (item) => item.karat === this.newItem.Karat
    );
  
    if (selectedKarat) {
      const karatPrice = selectedKarat.price;
      const netmetal = parseFloat((Number(this.newItem.netmetal) || 0).toFixed(2));
      const stone = Number(this.newItem.StoneAmt) || 0;
  
      let productPrice = 0;
  
      if (this.newItem.metalType === 'silver') {
        this.newItem.Karat = '24K'; 
        productPrice = (this.currentSilverPricePerGram * netmetal) + stone;
      } else {
        productPrice = ((this.currentGoldPricePerGram * karatPrice) / 100) * netmetal + stone;
      }
  
      this.newItem.price = parseFloat(productPrice.toFixed(2));
      this.newItem.cgst = parseFloat((productPrice * 1.5 / 100).toFixed(2));
      this.newItem.sgst = parseFloat((productPrice * 1.5 / 100).toFixed(2));
      this.newItem.makingcharge = parseFloat((productPrice * 15 / 100).toFixed(2));
  
      this.newItem.total = parseFloat(
        (productPrice + this.newItem.cgst + this.newItem.sgst + this.newItem.makingcharge).toFixed(2)
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
  paymentType:string='';

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
      pay: this.paymentType,
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
      this.apiService.addBillingDetails(itemToAdd).subscribe({
    
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
      this.totalAmountInBill+=item.total;
      // this.totalBill += item.total;
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
      const margin = 10;
      let yPosition = 20;
  
      // Column configuration remains the same
      const columns = [
        { header: 'No', width: 12, align: 'left' },
        { header: 'Item', width: 43, align: 'left' },
        { header: 'Price', width: 25, align: 'right' },
        { header: 'Making', width: 25, align: 'right' },
        { header: 'SGST', width: 20, align: 'right' },
        { header: 'CGST', width: 20, align: 'right' },
        { header: 'Discount', width: 25, align: 'right' },
        { header: 'Total', width: 30, align: 'right' }
      ];
  
      // Rest of the PDF generation code remains identical
      const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
      const tableWidth = pageWidth - 2 * margin;
      
      const drawCell = (text: string, x: number, width: number, align: 'left' | 'right') => {
        const padding = 3;
        const xPos = align === 'right' ? x + width - padding : x + padding;
        doc.text(text, xPos, yPosition + 5, { align });
      };
  
      const checkPageBreak = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = 20;
          drawHeader();
        }
      };
  
      const drawHeader = () => {
        doc.setFont("helvetica", "bold");
        doc.setFillColor(230, 230, 250);
        doc.rect(margin, yPosition, tableWidth, 8, 'F');
        
        let x = margin;
        columns.forEach(col => {
          drawCell(col.header, x, col.width, col.align as 'left' | 'right');
          x += col.width;
        });
        yPosition += 8;
      };
  
      doc.setFontSize(18);
      doc.text("Pratiom Jewellery", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;
  
      const details = [
        `Customer: ${this.partyName || 'N/A'}`, 
        `Address: ${this.address || 'N/A'}`,
        `Mobile: ${this.mobile || 'N/A'}`, 
        `Invoice: ${this.invoiceNo || 'N/A'}`
      ];
      
      details.forEach((detail, index) => {
        doc.setFontSize(10);
        doc.text(detail, margin, yPosition + (index * 6));
      });
      yPosition += 30;
  
      drawHeader();
  
      this.items.forEach((item, index) => {
        checkPageBreak(8);
        
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, yPosition, tableWidth, 8, 'F');
        }
  
        const rowData = [
          (index + 1).toString(),
          item.itemName?.substring(0, 20) || 'N/A',
          parseFloat(item.price).toFixed(2),
          parseFloat(item.makingcharge).toFixed(2),
          parseFloat(item.sgst).toFixed(2),
          parseFloat(item.cgst).toFixed(2),
          parseFloat(item.discount).toFixed(2),
          (parseFloat(item.total) - parseFloat(item.discount)).toFixed(2)
        ];
  
        let x = margin;
        columns.forEach((col, colIndex) => {
          drawCell(rowData[colIndex], x, col.width, col.align as 'left' | 'right');
          x += col.width;
        });
        
        yPosition += 8;
      });
  
      checkPageBreak(50);
      yPosition += 10;
  
      const summaryData = [
        { label: 'Subtotal:', value: this.items.reduce((a, b) => a + parseFloat(b.total), 0).toFixed(2) },
        { label: 'Total SGST:', value: this.items.reduce((a, b) => a + parseFloat(b.sgst), 0).toFixed(2) },
        { label: 'Total CGST:', value: this.items.reduce((a, b) => a + parseFloat(b.cgst), 0).toFixed(2) },
        { label: 'Total Making:', value: this.items.reduce((a, b) => a + parseFloat(b.makingcharge), 0).toFixed(2) },
        { label: 'Total Discount:', value: this.items.reduce((a, b) => a + parseFloat(b.discount), 0).toFixed(2) },
        { label: 'Grand Total:', value: this.items.reduce((a, b) => a + parseFloat(b.total) + 
          parseFloat(b.sgst) + parseFloat(b.cgst) + 
          parseFloat(b.makingcharge) - parseFloat(b.discount), 0).toFixed(2) }
      ];
  
      summaryData.forEach(row => {
        doc.setFontSize(10);
        doc.text(row.label, margin, yPosition);
        doc.text(row.value, pageWidth - margin, yPosition, { align: "right" });
        yPosition += 7;
      });
  
      checkPageBreak(30);
      yPosition += 15;
  
      const paymentHeader = ['Payment Method', 'Amount'];
      const payments = paymentSplits
      .filter((p: any) => p.invoiceNo === this.invoiceNo)
      .map((p: any) => ({
        method: p.paymentType.charAt(0).toUpperCase() + p.paymentType.slice(1),
        amount: p.money.toFixed(2)
      }));
  
      doc.setFont("helvetica", "bold");
      doc.setFillColor(230, 230, 250);
      doc.rect(margin, yPosition, pageWidth - 2*margin, 8, 'F');
      doc.text(paymentHeader[0], margin + 3, yPosition + 5);
      doc.text(paymentHeader[1], pageWidth - margin - 3, yPosition + 5, { align: "right" });
      yPosition += 8;
  
      doc.setFont("helvetica", "normal");
      payments.forEach((payment:any, index:number) => {
        checkPageBreak(8);
        
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, yPosition, pageWidth - 2*margin, 8, 'F');
        }
  
        doc.text(payment.method, margin + 3, yPosition + 5);
        doc.text(payment.amount, pageWidth - margin - 3, yPosition + 5, { align: "right" });
        yPosition += 8;
      });
  
      checkPageBreak(20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 10, { align: "center" });
  
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    }, error => {
      console.error('Error fetching payment splits:', error);
    });
  }
  
  
}
