import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { apiUrl } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) { }

    login(username: string, password: string) {
      return this.http.post<any>(`${apiUrl}security/login`,
      { username, password })
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
      }));
    }

    logout() {
        localStorage.removeItem('currentUser');
    }
}
