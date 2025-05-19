import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      (req, next) => {
        const token = localStorage.getItem('token');
        if (token) {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next(authReq);
        }
        return next(req);
      }
    ]))
  ]
};
