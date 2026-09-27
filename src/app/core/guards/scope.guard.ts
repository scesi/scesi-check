import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserScope } from '@shared/enums';

export const scopeGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredScope = route.data['scope'] as UserScope;

  if (!requiredScope) {
    return true;
  }

  // In a real implementation, you would check user scope from AuthService
  // For now, we allow access if authenticated
  if (authService.checkAuth()) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};