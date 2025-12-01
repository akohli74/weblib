// app/pages/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],   
})
export class DashboardComponent {
  recentActivity = [
    { member: 'Jaden Becker', activity: 'Checked out', book: 'Mockingbird', date: new Date('2024-05-20') },
    { member: 'Amanda Perkins', activity: 'Returned', book: '1984', date: new Date('2024-05-19') },
  ];
}
