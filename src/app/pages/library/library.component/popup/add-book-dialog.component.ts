import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export interface CreateBookInput {
  Title: string;
  Genre: string;
  Author: string;
  ISBN: string;
  NumberOfPages: number;
  PublicationDate: string;
}

@Component({
  selector: 'app-add-book-dialog',
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
  templateUrl: './add-book-dialog.component.html',
})
export class AddBookDialogComponent {
  form = new FormGroup({
    Title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    Genre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    Author: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    ISBN: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    NumberOfPages: new FormControl(0, { nonNullable: true, validators: [Validators.min(1)] }),
    PublicationDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private dialogRef: MatDialogRef<AddBookDialogComponent>) {}

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
    const payload: CreateBookInput = {
      ...this.form.getRawValue(),
      // Joined: joinedDate.toISOString()
    };

    this.dialogRef.close(payload);
  }
}