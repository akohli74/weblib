import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebLibService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  getBooks(): Observable<unknown> {
    return this.http.get('http://127.0.0.1:8000/book/get?identifierType=ISBN&identifierEntry=9780134610993');
  }

  getTransactions(): Observable<unknown> {
    return this.http.get('http://127.0.0.1:8000/transactions/get');
  };
}