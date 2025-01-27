import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

// Define interfaces
interface TotalValues {
  totalQuantity: number;
  totalSGST: number;
  totalCGST: number;
  totalProductPrice: number;
  totalMakingCharge: number;
  totalValue: number;
}

interface DataItem {
  invoiceNo: string;
  itemName: string;
  quantity: number;
  totalWeight: number;
  sgst: string;
  cgst: string;
  productPrice: number;
  discount: string;
  totalValue: number;
}

@Component({
  selector: 'app-gst-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gst-details.component.html',
  styleUrls: ['./gst-details.component.css'],
})
export class GstDetailsComponent implements OnInit {
  data: DataItem[] = [];
  filteredData: DataItem[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  pages: number[] = [];
  totalValues: TotalValues = {
    totalQuantity: 0,
    totalSGST: 0,
    totalCGST: 0,
    totalProductPrice: 0,
    totalMakingCharge: 0,
    totalValue: 0,
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://localhost:7088/api/Billing/GetAllBillingDetails').subscribe((response: any) => {
      this.data = response.data; 
      this.totalValues = response.totalValues;
      this.filteredData = this.data;
      console.log('my data is', this.data);

      this.updatePagination();
    }, error => {
      console.error('Error fetching data from API:', error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    this.filteredData = this.data.filter(item =>
      item.invoiceNo.toLowerCase().includes(filterValue) ||
      item.itemName.toLowerCase().includes(filterValue)
    );
  
    // Update pagination for the filtered data
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
    this.currentPage = 1;
    this.changePage(this.currentPage);
  }
  
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredData = this.data.slice(startIndex, endIndex);
  }
  
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.changePage(this.currentPage);
  }
  
}
