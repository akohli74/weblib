// app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { MatCardModule } from '@angular/material/card';
import { WebLibService } from '../../../services/weblib.service';
import { Transaction } from '../../../models/transaction';
import { Book } from '../../../models/book';
import { User } from '../../../models/user';
import { Activity } from '../../../models/activity';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookDetailComponent } from './popup/book-detail.component';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, MatCardModule, FormsModule, 
    MatFormFieldModule, MatInputModule, MatIconModule, 
    MatButtonModule, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],   
})
export class DashboardComponent implements OnInit {
  books: Book[] = [];
  transactions: Transaction[] = [];
  users: User[] = [];
  checkouts: number | undefined;
  latefees: number | undefined;
  overdues: number | undefined;
  newmembers: number | undefined;
  checkedoutbooks: number | undefined;
  totalbooks: number | undefined;
  totalmembers: number | undefined;
  recentActivity: Activity[] = [];
  searchText = '';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private webLib: WebLibService, private router: Router, private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const tx$    = this.webLib.getTransactions();  // Observable<...>
    const books$ = this.webLib.getBooks();               // Observable<...>
    const users$ = this.webLib.getUsers();               // Observable<...>

    forkJoin({
      transactions: tx$,
      books: books$,
      users: users$
    }).subscribe(({ transactions, books, users }) => {
      // all 3 finished here
      this.transactions = transactions.book;
      this.books = books.books;
      this.users = users.book;

      // 🔽 do whatever comes "after all the functions return"
      this.sortTransactions();
      this.buildDashboard();
    });
  }

  onSearch(): void {
    const term = (this.searchText ?? '').trim().toLowerCase();
    if (!term) return;

    // Match on Title / Author / ISBN (and exact BookID if user types a number)
    const asNumber = Number(term);
    const match = this.books.find(b =>
      (b.Title ?? '').toLowerCase().includes(term) ||
      (b.Author ?? '').toLowerCase().includes(term) ||
      (b.ISBN ?? '').toLowerCase().includes(term) ||
      (!Number.isNaN(asNumber) && b.BookID === asNumber)
    );

    if (!match) {
      // You can swap this for a snackbar later
      console.warn('No matching book found for:', term);
      return;
    }

    this.dialog.open(BookDetailComponent, {
      width: '720px',
      maxWidth: '95vw',
      data: match
    });
  }

  goToBooks() {
    this.router.navigate(['/library']);
  }

  sortTransactions(): Transaction[] {
    return this.transactions ? this.transactions.sort((a, b) => {
        // Determine the comparison date for each transaction
        const dateA =
          a.LastAction === "CHECKEDIN"
            ? new Date(a.CheckInDate as string)
            : new Date(a.CheckOutDate as string);

        const dateB =
          b.LastAction === "CHECKEDIN"
            ? new Date(b.CheckInDate as string)
            : new Date(b.CheckOutDate as string);

        return dateA.getTime() - dateB.getTime();
    }) : new Array<Transaction>();
  }

  buildDashboard(): void {
    const activity: Activity[] = [];
    this.transactions.slice(0, 5).forEach(t => {
      const book = this.books.find(b => b.BookID === t.BookID) ?? this.createEmptyBook(-99);
      const user = this.users.find(u => u.UserID === t.UserID) ?? this.createEmptyUser(-99);
      const date = t.LastAction === 'CHECKEDIN' ? t.CheckInDate : t.CheckOutDate;

      activity.push({
        member: `${user.FirstName} ${user.LastName}`,
        activity: `${(t.LastAction === 'CHECKEDIN' ? 'Checked-In' : 'Checked-Out')}`,
        book: `${book.Title}`,
        date: new Date(date ? date : Date.now())
      });
    });
    
    this.recentActivity = activity;

    this.calculateCounts();
  }

  calculateCounts(): void {
    this.totalbooks = this.books.length;
    this.totalmembers = this.users.length;
    this.checkouts = this.transactions.filter(t => this.getCheckouts(t)).length;
    this.latefees = this.users.reduce((sum, u) => sum + u.Fees, 0);
    this.overdues = this.books.filter(b => b.Late == 1).length;
    this.checkedoutbooks = this.transactions.filter(t => this.getCheckedOutBooks(t)).length;
    const today = new Date();
    const cutoff = new Date(today.getDate() - 15);
    this.newmembers = this.users.filter(u => new Date(u.Joined) < cutoff).length
  }

  getCheckedOutBooks(transaction: Transaction): boolean {
    return transaction.LastAction === "CHECKEDOUT";
  }

  getCheckouts(transaction: Transaction) : boolean {
    const today = new Date();
    const cutoff = new Date();
    cutoff.setDate(today.getDate() - 30);
    return (
      transaction.LastAction === 'CHECKEDOUT' &&
      transaction.CheckOutDate !== null &&
      new Date(transaction.CheckOutDate) > cutoff
    );
  }

  createEmptyBook(bookId: number): Book {
    return {
      BookID: bookId,
      Title: "",
      Genre: "",
      Author: "",
      ISBN: "",
      NumberOfPages: 0,
      PublicationDate: "",
      CheckedOut: 0,
      Late: 0,
      Missing: 0,
      CurrentTransactionID: 0
    };
  }

  createEmptyUser(userId: number): User {
    return {
      UserID: userId,
      FirstName: "",
      LastName: "",
      Email: "",
      Joined: "",
      Fees: 0,
      isGuest: 0,
      Status: "Active"
    };
  }
}