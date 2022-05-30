import { Injectable } from '@angular/core';

import { LocalStorageService } from 'ngx-webstorage';
import { CoreService } from './core.service';

export interface Credential {
  customer_id: string;
  name: string;
  email: string;
  status: string;
  phone_number: string;
  profile_image: string;
}

const credentialsKey = 'token';

/**
 * Provides storage for authentication credential.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private _credential: Credential | null = null;

  constructor(
    private localStorageService: LocalStorageService,
    private coreService: CoreService
  ) {
    this.coreService.notifyObservable$.subscribe((data) => {
      if (data.option === 'logout') {
        this._credential = null;
      }
    });
    const savedCredentials = this.localStorageService.retrieve(credentialsKey);
  }

  /**
   * Checks is the user is authenticated.
   *
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return true;
  }

  tokenExpirationTimeLeft(): Date {
    return new Date();
  }

  checkAuthentication(setCreden?) {
    if (this._credential && !this.coreService.loggedIn()) {
      this.coreService.logout();
    }
  }

  /**
   * Gets the user credential.
   *
   * @return The user credential or null if the user is not authenticated.
   */
  get credential(): Credential | null {
    return this._credential;
  }

  /**
   * Sets the user credential.
   * The credential are only persisted for the current session.
   *
   * @param credential The user credential.
   */
  setCredentials(token, credential?) {
    this._credential = credential || null;
    if (credential) {
      if (token) {
        this.localStorageService.store(credentialsKey, token);
      }
    } else {
      this.localStorageService.clear(credentialsKey);
    }
  }
}
