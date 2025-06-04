import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 
      TestBed.runInInjectionContext(() => {
        const router = TestBed.inject(Router);
        const guard = new AuthGuard(router);
        const mockRoute = {} as ActivatedRouteSnapshot;
        return guard.canActivate(mockRoute);
      });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
