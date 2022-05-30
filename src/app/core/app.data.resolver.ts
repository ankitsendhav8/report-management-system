import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CoreService } from '@app/core/core.service';

@Injectable()
export class AppDataResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private http: HttpClient,
    private coreService: CoreService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let params = '';
    const api = route.data['detailApi'];
    if (route.params['id']) {
      params = route.params['id'];
    }
    return this.http.get(`${api}${params}`).pipe(
      map((res: any) => {
        if (res && res.settings.success) {
          return res.data;
        }
        this.coreService.displayToast({
          message: res.settings.message,
          type: 'error',
        });
        this.router.navigate([route.data['redirectTo']]);
        return null;
      })
    );
  }
}
