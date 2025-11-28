// app/pages/checkout/checkout.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-title>Checkouts</mat-card-title>
      <mat-card-content>
        <p>Welcome to Checkouts.</p>
      </mat-card-content>
    </mat-card>
  `
})
export class AdminComponent {}