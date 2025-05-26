import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn('Usuário não autorizado');
          // redirecionar para login ou mostrar notificação
        } else if (error.status === 500) {
          console.error('Erro interno do servidor');
        } else {
          console.warn(`Erro: ${error.status} - ${error.message}`);
        }

        return throwError(() => error);
      })
    );
  }
}
