import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getConventionCodes()  { return this.http.get<string[]>(`${this.apiUrl}/ref/conventions/codes`); }
  getStatuses()         { return this.http.get<string[]>(`${this.apiUrl}/ref/conventions/statuses`); }
  getApplications()     { return this.http.get<string[]>(`${this.apiUrl}/ref/applications`); }
  getClients()          { return this.http.get<string[]>(`${this.apiUrl}/ref/clients`); }
}

