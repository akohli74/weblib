import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export interface CreateUserInput {
  firstname: string;
  lastname: string;
  email: string;
  // Joined: string;   // ISO date string
  // Fees: number;
  // isGuest: number;  // 0 or 1
  // Status: string;
}

@Component({
  selector: 'app-add-customer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './add-customer-dialog.component.html',
})
export class AddCustomerDialogComponent {
  form = new FormGroup({
    firstname: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastname: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    // Joined: new FormControl('', { nonNullable: true, validators: [Validators.required] }), // yyyy-mm-dd
    // Fees: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    // isGuest: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
    // Status: new FormControl('Active', { nonNullable: true, validators: [Validators.required] }),
  });

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private dialogRef: MatDialogRef<AddCustomerDialogComponent>) {}

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Convert yyyy-mm-dd -> ISO string (e.g., 2025-12-13T00:00:00.000Z)
    // const joinedDate = new Date(this.form.controls.Joined.value);
    const payload: CreateUserInput = {
      ...this.form.getRawValue(),
      // Joined: joinedDate.toISOString()
    };

    this.dialogRef.close(payload);
  }
}