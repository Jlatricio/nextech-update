import { ApplicationConfig, Injector, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import Swal from 'sweetalert2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-center',
      timeOut: 4000,
      closeButton: true,
    }),
    { provide: LOCALE_ID, useValue: 'pt-AO' },
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const injector = inject(Injector);
          const router = injector.get(Router);
          const token = localStorage.getItem('token');

          const authReq = token
            ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : req;

          return next(authReq).pipe(
            catchError(error => {
              if (error.status === 401) {
                localStorage.removeItem('token');

                if (router.url !== '/login') {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Sessão Expirada',
                    text: 'Sua sessão expirou. Por favor, faça login novamente.',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    timer: 4000
                  });

                  router.navigate(['/login']);
                }
              }

              return throwError(() => error);
            })
          );
        }
      ])
    )
  ]
};
