import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-customer-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './customer-detail-dialog.component.html',
})
export class CustomerDetailDialogComponent {
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {}
}