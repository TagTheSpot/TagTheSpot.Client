import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;
  
  if (!auth.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (requiredRoles && !auth.hasAnyRole(requiredRoles)) {
    router.navigate(['/forbidden']);
    return false;
  }

  if (auth.getAccessToken()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
