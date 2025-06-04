// responsable.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Responsable } from '../models/responsable.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsableService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getResponsableNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/responsables/names`);
  }

  getResponsables(): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(`${this.apiUrl}/responsables/all`);
  }
  
}
