import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
    getAllApplications(): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}/applications/get-all-applications`);
      }
    addApplication(application: Application): Observable<Application> {
        return this.http.post<Application>(`${this.apiUrl}/applications/save-application`, application);
      }
      deleteApplication(uuid: string): Observable<void> {
        return this.http.get<void>(`${this.apiUrl}/applications/delete-application?uuid=${uuid}`);
      }
    getApplicationByUuid(uuid: string): Observable<Application> {
      return this.http.get<Application>(`${this.apiUrl}/applications/get-application?uuid=${uuid}`);
        }
     updateApplication(application: Application): Observable<Application> {
        return this.http.post<Application>(`${this.apiUrl}/applications/update-application`, application);
      }
}
