import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { WebLibService } from '../../services/weblib.service'; // <-- adjust path
import { Router } from '@angular/router';
import { EventingService } from '../../services/eventing.service';

type TxAction = 'CHECK_OUT' | 'CHECK_IN';

@Component({
  selector: 'app-scan-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './scan-transaction-dialog.component.html',
})
export class ScanTransactionDialogComponent {
  isSubmitting = false;

  form = new FormGroup({
    ISBN: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    CustomerId: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    Action: new FormControl<TxAction>('CHECK_OUT', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private dialogRef: MatDialogRef<ScanTransactionDialogComponent>,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private webLib: WebLibService, private router: Router,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private eventingService: EventingService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { ISBN, CustomerId, Action } = this.form.getRawValue();

    // Guard (TS safety)
    if (!CustomerId) return;

    this.isSubmitting = true;

    if (Action === 'CHECK_OUT') {
      // ✅ Call your checkout method
      this.webLib.checkoutBook(ISBN.trim(), CustomerId).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.eventingService.emit({ type: 'REFRESH_BOOKS'});
          this.dialogRef.close(true);
        },
        error: (err: Error) => {
          this.isSubmitting = false;
          console.error('Checkout failed', err);
        }
      });
      return;
    }

    // OPTIONAL: Check In support (if/when your service has it)
    this.webLib.checkInBook(ISBN.trim(), CustomerId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.eventingService.emit({ type: 'REFRESH_BOOKS' });
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.isSubmitting = false;
        console.error('Check-in failed', err);
      }
    });
  }
}