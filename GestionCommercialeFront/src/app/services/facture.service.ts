import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from '../models/facture.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getAllFactures(): Observable<Facture[]> {
      return this.http.get<Facture[]>(`${this.apiUrl}/factures/get-all-factures`);
      }

  deleteFacture(uuid: string): Observable<void> {
        return this.http.get<void>(`${this.apiUrl}/factures/delete-facture?uuid=${uuid}`);
        }
  updateFacture(facture: Facture): Observable<Facture> {
        return this.http.post<Facture>(`${this.apiUrl}/factures/update-facture`, facture );
      }
  addFacture(facture: Facture): Observable<Facture> {
        return this.http.post<Facture>(`${this.apiUrl}/factures/save-facture`, facture);
  }
  getFactureByUuid(uuid: string): Observable<Facture> {
        return this.http.get<Facture>(`${this.apiUrl}/factures/get-facture?uuid=${uuid}`);
  }
  printFacture(uuid: string): Observable<Blob> {
      return this.http.get(
        `${this.apiUrl}/factures/print/${uuid}`,{ responseType: 'blob' });
    }
}