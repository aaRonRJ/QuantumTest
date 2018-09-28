import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { apiUrl } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  // Get articles only page 0.
  getArticles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${ apiUrl }articles?page=0`)
      .subscribe((data: any) => {
        if (data && data.content) {
          resolve(data.content);
        } else {
          reject(null);
        }
      });
    });
  }

  // Get article, param: id article.
  getArticle(id: string): Observable<any> {
    return this.http.get(`${ apiUrl }articles/${ id }`)
    .pipe(
      map((data: any) => {
        if (data) {
          if (data.status) {
            return {
              status: data.status,
              data: this.checkError(data.status)
            };
          } else {
            return {
              status: 200,
              data: data
            };
          }
        } else {
          return {
            status: 500,
            data: 'Error'
          };
        }
      })
    );
  }

  // Post comment in article, param: comment text, article id.
  publishComment(text: string, articleId: string): Observable<any> {
    return this.http.post(`${ apiUrl }articles/${ articleId }/comments`, { text })
    .pipe(
      map((data: any) => {
        return data.article.comments;
      }),
      catchError(_ => {
        return of(null);
      })
    );
  }

  // Delete comment in article, params: idArticle, idComment, sessionUserToken.
  deleteComment(idArticle: string, idComment: string, sessionUserToken: string): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${ sessionUserToken }`
    });

    return new Promise((resolve, reject) => {
      this.http.delete(`${ apiUrl }articles/${ idArticle }/comments/${ idComment }`, { headers: headers })
      .subscribe((data: any) => {
        if (data && data.status && data.status === 401) {
          reject('Unauthorized');
        } else {
          resolve('Deleted');
        }
      });
    });
  }

  checkError(status: number): string {
    let error: string;

    switch(status) {
      case 404:
        error = 'Not found';
        break;

      case 401:
        error = 'Unauthorized';
        break;

      case 405:
        error = 'Method not allowed';
        break;

      default:
        error = 'Unknown';
        break;
    }

    return error;
  }
}
