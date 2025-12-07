// app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { MatCardModule } from '@angular/material/card';
import { WebLibService } from '../../../services/weblib.service';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],   
})
export class DashboardComponent implements OnInit {
  books: unknown;
  transactions: unknown;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private webLib: WebLibService) {}

  ngOnInit(): void {
    this.webLib.getTransactions().subscribe( {
      next: t => { this.transactions = t },
      error: err => { console.error('Error loading transactions', err); }
    });
    this.webLib.getBooks().subscribe({
      next: d => { this.books = d; },
      error: err => console.error('Error loading stuff', err)
    });
  }
  recentActivity = [
    { member: 'Jaden Becker', activity: 'Checked out', book: 'Mockingbird', date: new Date('2024-05-20') },
    { member: 'Amanda Perkins', activity: 'Returned', book: '1984', date: new Date('2024-05-19') },
  ];
}