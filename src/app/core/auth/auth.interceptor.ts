import { HttpInterceptorFn  } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        const refreshToken = authService.getRefreshToken();

        if (refreshToken) {
          console.log('Refreshing token..');
          return authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = authService.getAccessToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              console.log('Refresh successful.');
              
              return next(retryReq);
            }),
            catchError(() => {
              authService.removeTokens();
              router.navigate(['/login']);
              console.log('Refresh failed.');

              return throwError(() => err);
            })
          );
        } else {
          authService.removeTokens(); 
          router.navigate(['/login']);
        }
      }

      return throwError(() => err);
    })
  );
};
