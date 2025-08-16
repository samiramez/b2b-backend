import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, UserRole } from '../../services/auth.service';

export const roleGuard: CanMatchFn = (
  route: Route,
  _segments: UrlSegment[]
) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data?.['roles'] as UserRole[] | undefined) ?? [];

  if (!auth.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }
  // if (roles.length === 0) return true; // unauthorized

  const ok = auth.hasRole(roles);
  if (!ok) router.navigateByUrl('/products');
  return ok;
};
