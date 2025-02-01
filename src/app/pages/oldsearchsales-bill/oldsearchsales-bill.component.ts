import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarDay, faSearch, faSync, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../services/api-service';

interface DataItem {
  invoiceNo: string;
  partyName: string;
  itemName: string;
  quantity: number;
  totalWeight: number;
  sgst: number;
  cgst: number;
  price: number;
  discount: number;
  totalValue: number;
  makingCharge: number;
  invoiceDate: string;
  total: number;
}

@Component({
  selector: 'app-oldsearchsales-bill',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './oldsearchsales-bill.component.html',
  styleUrl: './oldsearchsales-bill.component.css'
})
export class OldsearchsalesBillComponent implements OnInit {
  faSearch = faSearch;
  faCalendarDay = faCalendarDay;
  faSync = faSync;
  faTimes = faTimes;

  data: DataItem[] = [];
  filteredData: DataItem[] = [];
  displayedData: DataItem[] = [];
  searchTerm = '';
  selectedDate = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];

  // Totals
  totalValues = {
    totalQuantity: 0,
    totalSGST: 0,
    totalCGST: 0,
    totalPrice: 0,
    totalMakingCharge: 0,
    totalDiscount: 0,
    grandTotal: 0,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getInvoiceDetails().subscribe({
      next: (response) => {
        this.data = this.transformApiResponse(response);
        this.applyFilters();
      },
      error: (error) => console.error('Error:', error)
    });
  }
  private parseCurrency(value: string): number {
    return parseFloat(value.replace(/[^0-9.]/g, ''));
  }
  private transformApiResponse(response: any): DataItem[] {
    return response.data.flatMap((invoice: any) => 
      invoice.items.map((item: any) => ({
        invoiceNo: invoice.invoiceNo,
        partyName: invoice.partyName,
        invoiceDate: invoice.invoiceDate,
        itemName: item.itemName,
        quantity: item.quantity,
        totalWeight: item.totalWeight,
        price: this.parseCurrency(item.price),
        sgst: this.parseCurrency(item.sgst),
        cgst: this.parseCurrency(item.cgst),
        makingCharge: this.parseCurrency(item.making),
        discount: this.parseCurrency(item.discount),
        total: this.parseCurrency(item.total)
      }))
    );
  }

  refresh() {
    this.searchTerm = '';
    this.selectedDate = '';
    this.currentPage = 1;
    this.loadData();
  }

  applyFilter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.applyFilters();
  }

  applyDateFilter(event: Event) {
    this.selectedDate = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  clearDate() {
    this.selectedDate = '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData = this.data.filter(item => {
      // Date filtering
      const invoiceDate = new Date(item.invoiceDate).toISOString().split('T')[0];
      const dateMatch = !this.selectedDate || invoiceDate === this.selectedDate;

      // Search filtering
      const searchMatch = !this.searchTerm || 
        item.invoiceNo.toLowerCase().includes(this.searchTerm) ||
        item.partyName.toLowerCase().includes(this.searchTerm) ||
        item.itemName.toLowerCase().includes(this.searchTerm);

      return dateMatch && searchMatch;
    });

    this.calculateTotals();
    this.updatePagination();
  }

  calculateTotals() {
    this.totalValues = this.filteredData.reduce((acc, item) => ({
      totalQuantity: acc.totalQuantity + item.quantity,
      totalSGST: acc.totalSGST + item.sgst,
      totalCGST: acc.totalCGST + item.cgst,
      totalPrice: acc.totalPrice + item.price,
      totalMakingCharge: acc.totalMakingCharge + item.makingCharge,
      totalDiscount: acc.totalDiscount + item.discount,
      grandTotal: acc.grandTotal + item.total
    }), {
      totalQuantity: 0,
      totalSGST: 0,
      totalCGST: 0,
      totalPrice: 0,
      totalMakingCharge: 0,
      totalDiscount: 0,
      grandTotal: 0
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.changePage(1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      this.displayedData = [];
      return;
    }
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedData = this.filteredData.slice(start, end);
  }
}