import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionResponse } from '../models/transaction'
import { BookResponse, CreateBookRequest } from '../models/book';
import { UserResponse } from '../models/user';
import { CreateUserInput } from '../pages/customers/customers.component/popup/add-customer-dialog.component';
import { LoginResponse } from '../models/login';
import { CreateBookInput } from '../pages/library/library.component/popup/add-book-dialog.component';
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

  addCustomer(customerData: CreateUserInput): Observable<UserResponse> {
    return this.http.post<UserResponse>('http://127.0.0.1:8000/user/add', customerData);
  }

  addBook(bookData: CreateBookInput): Observable<BookResponse> {
    const requestBody = this.CreateBookRequestPayload(bookData);
    return this.http.post<BookResponse>('http://127.0.0.1:8000/book/add', requestBody);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://127.0.0.1:8000/login', { username, password });
  }

  checkoutBook(bookId: string, userId: number): Observable<TransactionResponse> {
    const bookIdentifierType = 'ISBN';
    const bookIdentifierEntry = bookId;
    const notes = 'Checked out from the library';
    return this.http.post<TransactionResponse>('http://127.0.0.1:8000/book/checkout', { userId, bookIdentifierType, bookIdentifierEntry, notes });
  }

  checkInBook(bookId: string, userId: number): Observable<TransactionResponse> {
    const notes = 'Checked in to the library';
    const bookISBN = bookId;
    return this.http.post<TransactionResponse>('http://127.0.0.1:8000/book/checkin', { userId, bookISBN, notes });
  }

  private CreateBookRequestPayload(bookData: CreateBookInput): CreateBookRequest {
    return {
      
      title: bookData.Title,
      author: bookData.Author,
      isbn: bookData.ISBN,
      numberOfPages: bookData.NumberOfPages,
      publicationDate: bookData.PublicationDate
    };
  }
}