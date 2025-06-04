import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

export interface ConventionRowDto {
  code:         string;
  startDate:    string; 
  endDate:      string;
  status:       string;
  client:       string;
  application:  string;
}

export interface GenerationResultDto {
  sql:  string;
  rows: ConventionRowDto[];
}

@Injectable({
  providedIn: 'root'
})
export class GenerationService {
private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  genAndExec(payload: any):
   Observable<any> {return this.http.post<GenerationResultDto>(`${this.apiUrl}/api/generation/execute`,payload );
  }

}