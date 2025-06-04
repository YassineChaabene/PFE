// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const token = this.authService.getToken();
    const allowedRoles: string[] = route.data['roles'] || [];

    if (!token) {
      this.router.navigate(['/auth/login']);
      return of(false);
    }

    const userRole = this.authService.getUserRoleFromToken();

    if (!userRole) {
      this.router.navigate(['/auth/login']);
      return of(false);
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return of(true);
    }

    this.router.navigate(['/auth/login']);
    return of(false);
  }
}
