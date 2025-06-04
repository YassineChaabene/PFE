import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environments';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private logoutTimer: any;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ jwt: string; uuid: string; role: string; name: string }> {
    return this.http.post<{ jwt: string; uuid: string; role: string; name: string }>(
      `${this.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => {
        if (!response.jwt || !response.uuid || !response.role) {
          throw new Error('Invalid login response');
        }
        localStorage.setItem('token', response.jwt);
        this.startAutoLogout();
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const authorities = payload?.roles;

      if (Array.isArray(authorities) && authorities.length > 0) {
        return authorities[0]?.authority?.toUpperCase() ?? null;
      }
      return null;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  getNameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.name ?? null;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }
  getTelephoneFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.telephone ?? null;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }
  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.email ?? null;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.exp ? payload.exp * 1000 : null; 
    } catch (e) {
      console.error('Failed to decode token expiration:', e);
      return null;
    }
  }

  startAutoLogout(): void {
    const expiration = this.getTokenExpiration();
    if (!expiration) return;

    const now = Date.now();
    const timeUntilExpiry = expiration - now;

    if (timeUntilExpiry > 0) {
      this.logoutTimer = setTimeout(() => {
        this.logout();
        window.location.href = '/auth/login';
      }, timeUntilExpiry);
    } else {
      this.logout();
      window.location.href = '/auth/login';
    }
  }

  listenToStorageChanges(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'token') {
        const token = event.newValue;
        if (token) {
          this.startAutoLogout(); // Restart logout timer in other tab
          window.location.reload();
        } else {
          window.location.href = '/auth/login';
        }
      }
    });
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const expiration = this.getTokenExpiration();
  
    return !!token && expiration !== null && Date.now() < expiration;
  }
  

  logout(): void {
    localStorage.removeItem('token');
    clearTimeout(this.logoutTimer);
  }
}
