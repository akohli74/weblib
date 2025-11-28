// app/pages/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-title>Dashboard</mat-card-title>
      <mat-card-content>
        <p>Welcome to the dashboard.</p>
      </mat-card-content>
    </mat-card>
  `
})
export class DashboardComponent {}