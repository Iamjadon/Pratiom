import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { environment } from '../config/environment';
import { LoginRequest } from '../models/login.model';
import { metalprice } from '../models/metalprice.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loginUser(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.LOGIN}`, data);
  }

  updatemetalprice(data: metalprice): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.UPDATEMETALPRICES}`, data);
  }

  getemetalprice(): Observable<metalprice> {
    return this.http.get<metalprice>(`${this.baseUrl}${API_ENDPOINTS.GETMETALPRICE}`, {
      withCredentials: true  
    });

  }

  getBillingDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.GETBILLINGDETAILS}`);
  }


  getGoldAndSilverPrice(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${API_ENDPOINTS.GOLDANDSILVERPRICES}`);
  }

  addBillingDetails(item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.ADDBILLINGDETAILS}`, item);
  }

  splitPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.SPLITPAYMENT}`, paymentData);
  }
  getsplitPayment(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.GETSPLITPAYMENT}`);
  }

  // getBillingDetailsByInvoice(invoiceNo: string): Observable<any> {
  //   return this.http.get(`${this.baseUrl}${API_ENDPOINTS.GETBILLINGDETAILS_BY_INVOICE}?invoiceNo=${invoiceNo}`);
  // }

  // getPaymentDetailsByInvoice(invoiceNo: string): Observable<any> {
  //   return this.http.get(`${this.baseUrl}${API_ENDPOINTS.GETPAYMENTDETAILS_BY_INVOICE}?invoiceNo=${invoiceNo}`);
  // }

  // getBillingDetailsByInvoice(invoiceNo: string): Observable<any> {
  //   return this.http.get(`${this.baseUrl}${API_ENDPOINTS.GETBILLINGDETAILS_BY_INVOICE}?invoiceNo=${invoiceNo}`);
  // }

  getBillingDetailsByInvoice(invoiceNo: string): Observable<any> {
    const encodedInvoiceNo = encodeURIComponent(invoiceNo);
    return this.http.get(`${this.baseUrl}/api/Billing/search?invoiceNo=${encodedInvoiceNo}`);
  }
  
  getPaymentDetailsByInvoice(invoiceNo: string): Observable<any> {
    const encodedInvoiceNo = encodeURIComponent(invoiceNo);
    return this.http.get(`${this.baseUrl}/api/PaymentSplit/search?invoiceNo=${encodedInvoiceNo}`);
  }
  
  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.CREATEINVOICE}`, invoiceData);
  }

  getLastInvoiceNumber(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.GETLASTINVOICENUMBER}`);
  }

  getInvoiceDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.GETINVOICEDETAILS}`);
  }
}  
