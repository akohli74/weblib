import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebLibService } from '../../../services/weblib.service';
import { Book } from '../../../models/book';
import { Transaction } from '../../../models/transaction';
import { User } from '../../../models/user';
import { filter, forkJoin } from 'rxjs';
import { EventingService } from '../../../services/eventing.service';

type CheckoutStatus = 'Active' | 'Overdue' | 'Lost';

interface CheckoutRow {
  customer: string;
  bookTitle: string;
  bookSubtitle?: string;
  checkoutDate: string; // nice text, like "May 1 2024"
  dueDate: string;
  status: CheckoutStatus;
  fees: number;
}

type FeeFilter = 'All' | 'Zero' | 'NonZero';
type DateRangeFilter = 'All' | 'Past7' | 'Past30';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  books: Book[] = [];
  transactions: Transaction[] = [];
  users: User[] = [];
  
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(@Inject(WebLibService) private webLib: WebLibService, private eventingService: EventingService) { }

  statusFilter: CheckoutStatus | 'All' = 'All';
  dateRangeFilter: DateRangeFilter = 'All';   // for now just UI, not strict logic
  feeFilter: FeeFilter = 'All';

  checkouts: CheckoutRow[] = [];

  ngOnInit() {
    this.eventingService.commands$
      .pipe(filter(c => c.type === 'REFRESH_BOOKS'))
      .subscribe(() => {
        this.loadPage();
      });
    this.loadPage();
  }

  private loadPage() {
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

      this.transactions.map(transaction => {
        const user = this.users.find(user => user.UserID === transaction.UserID);
        const book = this.books.find(book => book.BookID === transaction.BookID);
        if (user && book) {
          this.checkouts.push({
            customer: user.FirstName + ' ' + user.LastName,
            bookTitle: book.Title,
            checkoutDate: transaction.CheckOutDate ? transaction.CheckOutDate : 'Checked In',
            dueDate: transaction.DueDate ? transaction.DueDate : 'Checked In',
            status: transaction.DueDate && Date.parse(transaction.DueDate) > Date.now() ? 'Overdue' : 'Active',
            fees: user.Fees ? user.Fees : 0
          });
        }
      })
    });
  }

  get filteredCheckouts(): CheckoutRow[] {
    return this.checkouts.filter(row => {
      const matchesStatus =
        this.statusFilter === 'All' || row.status === this.statusFilter;

      const matchesFees =
        this.feeFilter === 'All'
          ? true
          : this.feeFilter === 'Zero'
          ? row.fees === 0
          : row.fees > 0;

      // Date range filter is just a stub for now; could be extended later
      const matchesDateRange = true;

      return matchesStatus && matchesFees && matchesDateRange;
    });
  }

  resetFilters() {
    this.statusFilter = 'All';
    this.dateRangeFilter = 'All';
    this.feeFilter = 'All';
  }
}


