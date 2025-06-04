import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { environment } from '../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients/get-all-client`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/get-client?id=${id}`);
  }

  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients/save-client`, client);
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients/update-client`, client);
  }

  deleteClient(uuid: string): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/clients/delete-client?uuid=${uuid}`);
  }
  getClientByUuid(uuid: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/get-client-by-uuid?uuid=${uuid}`);
  }
  checkCodeExists(code: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/clients/code-exists?code=${code}`);
  }
  
}
