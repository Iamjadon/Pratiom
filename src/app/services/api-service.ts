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
      withCredentials: true  // Include credentials (cookies, authorization headers) in the request
    });
  }
  

  
}  
