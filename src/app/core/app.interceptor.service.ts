import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError as observableThrowError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CoreService } from '@core/core.service';
import { environment } from '@environments/environment';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private coreService: CoreService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const regExp = new RegExp(/assets/g, 'i');
    const newReq = req.clone({
      url: regExp.test(req.url)
        ? req.url
        : `${environment.serviceUrl}${req.url}`,
    });

    return next.handle(newReq).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 && err.statusText === 'Unauthorized') {
              this.coreService.logout();
            }
          }
          return observableThrowError(
            new Error('Internal server error occurred!')
          );
        }
      )
    );
  }
}
