// app/pages/customers/customers.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-customers-page',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-title>Customers</mat-card-title>
      <mat-card-content>
        <p>Welcome to the customers.</p>
      </mat-card-content>
    </mat-card>
  `
})
export class CustomersComponent {}