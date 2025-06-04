// src/app/services/revenue.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface YearlyRevenue {year:   number;total:  number;}
export interface MonthlyRevenue { date: string; total: number; }

@Injectable({ providedIn: 'root' })
export class RevenueService {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHistorical(): Observable<YearlyRevenue[]> {
    return this.http.get<YearlyRevenue[]>(`${this.apiUrl}/api/revenue/historical`);
  }
  getPredictions(periods = 5): Observable<MonthlyRevenue[]> {
    return this.http.get<MonthlyRevenue[]>(`${this.apiUrl}/api/revenue/predict?periods=${periods}`);
  }
  getHistoricalMonthly(): Observable<MonthlyRevenue[]> {
  return this.http.get<MonthlyRevenue[]>(`${this.apiUrl}/api/revenue/historical-monthly`);
  }
getHistoricalMonthlyAll(): Observable<MonthlyRevenue[]> {
  return this.http.get<MonthlyRevenue[]>(`${this.apiUrl}/api/revenue/historical-monthly-all`);
}
getAllPredictions(periods = 5): Observable<MonthlyRevenue[]> {
  return this.http.get<MonthlyRevenue[]>(`${this.apiUrl}/api/revenue/predict-all?periods=${periods}`);
}

}
