import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { FactureDto } from '../models/facture.dto';
import { ClientDto } from '../models/client.dto';

export interface DashboardMetrics {
  totalApplications: number;
  totalClients: number;
  activeConventions: number;
  totalRevenue: number;
  
}

export interface ConventionsByMonth {
  [month: string]: number;
}

export interface ByYear { 
  [year: string]: number; 
}
export interface ByMonth { 
  [month: string]: number
 }

export interface InvoiceStatus {
  [status: string]: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/dashboard/metrics`);
  }
  getConventionsByMonth(): Observable<ConventionsByMonth> {
    return this.http.get<ConventionsByMonth>(`${this.apiUrl}/dashboard/metrics/conventions-by-month`);
  }
  getConventionsByYear(): Observable<ByYear> {
    return this.http.get<ByYear>(`${this.apiUrl}/dashboard/metrics/conventions-by-year`);
  }
 getUpcomingConventionsByYear(): Observable<ByYear> {
    return this.http.get<ByYear>(`${this.apiUrl}/dashboard/metrics/conventions-upcoming-by-year`);
  }
  getInvoiceStatus(): Observable<InvoiceStatus> {
    return this.http.get<InvoiceStatus>(`${environment.apiUrl}/dashboard/metrics/invoice-status`);
  }

  recentInvoices(limit = 5): Observable<FactureDto[]> {
    return this.http.get<FactureDto[]>(`${this.apiUrl}/dashboard/metrics/recent-invoices?limit=${limit}`);
  }

  clientsByRegion(): Observable<Record<string,number>> {
    return this.http.get<Record<string,number>>(`${this.apiUrl}/dashboard/metrics/clients-by-region`);
  }

  monthlyRevenue(monthsBack = 6): Observable<Record<string,number>> {
    return this.http.get<Record<string,number>>(`${this.apiUrl}/dashboard/metrics/monthly-revenue?monthsBack=${monthsBack}`);
  }

}
