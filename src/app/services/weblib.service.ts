import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionResponse } from '../models/transaction'
import { BookResponse } from '../models/book';
import { UserResponse } from '../models/user';
@Injectable({ providedIn: 'root' })
export class WebLibService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  getBooks(): Observable<BookResponse> {
    return this.http.get<BookResponse>(`http://127.0.0.1:8000/book/get`);
  }

  getBook(userId: number): Observable<BookResponse> {
    return this.http.get<BookResponse>(`http://127.0.0.1:8000/book/get?UserID=${userId}`);
  }

  getTransactions(): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>('http://127.0.0.1:8000/transactions/get');
  };

  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>('http://127.0.0.1:8000/user/get');
  }
}