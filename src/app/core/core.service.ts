import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CoreService {
  public notify = new Subject<{ option: string; value: any }>();

  /**
   * Observable string streams
   */
  notifyObservable$ = this.notify.asObservable();

  public closeModalSubject = new Subject<string>();

  public closeModalObservable = this.closeModalSubject.asObservable();

  confirmTemplate: any;

  confirmModal: { message: string; header: string } = {
    message: '',
    header: '',
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private localStorage: LocalStorageService
  ) {}

  navigateTo(
    url: string,
    params?: undefined,
    extras?: NavigationExtras | undefined
  ) {
    if (params) {
      this.router.navigate([url, params], extras);
    } else {
      this.router.navigate([url]);
    }
  }

  loggedIn(): boolean {
    return true;
  }

  public clear(key: string): void {
    if (key) {
      return this.localStorage.clear(key);
    }
  }

  public notifyOther(data: { option: string; value: any }) {
    if (data) {
      this.notify.next(data);
    }
  }

  public erase(): void {
    this.localStorage.clear();
  }

  public store(key: string, value: any): void {
    return this.localStorage.store(key, value);
  }

  public retrieve(key: string): any {
    return this.localStorage.retrieve(key);
  }

  public closeModal() {
    // this.closeModalSubject.next();
  }

  logout() {
    this.erase();
    this.notifyOther({ option: 'logout', value: true });
    this.navigateTo('/login');
  }

  displayToast(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string
  ) {
    this.toastr['type'](message);
  }

  showConfirmModal(message, header?) {
    this.confirmModal.message = message;
    this.confirmModal.header = header || 'Confirmation';
    return this.modalService.open(this.confirmTemplate, { centered: true })
      .result;
  }
}
