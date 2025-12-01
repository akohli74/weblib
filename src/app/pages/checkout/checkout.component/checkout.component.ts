// app/pages/checkout/checkout.component.ts
// app/pages/checkout/checkout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class CheckoutComponent {
  statusFilter: CheckoutStatus | 'All' = 'All';
  dateRangeFilter: DateRangeFilter = 'All';   // for now just UI, not strict logic
  feeFilter: FeeFilter = 'All';

  checkouts: CheckoutRow[] = [
    {
      customer: 'Jenny Rodgers',
      bookTitle: 'The Catcher in the Rye',
      bookSubtitle: '',
      checkoutDate: 'May 1 2024',
      dueDate: 'May 31 2024',
      status: 'Active',
      fees: 4.5,
    },
    {
      customer: 'Tyler Alexander',
      bookTitle: 'Moby-Dick',
      checkoutDate: 'Apr. 18 2024',
      dueDate: 'May 2 2024',
      status: 'Overdue',
      fees: 0.4,
    },
    {
      customer: 'Christina James',
      bookTitle: 'Sapiens',
      checkoutDate: 'Apr. 10 2024',
      dueDate: 'Apr. 24 2024',
      status: 'Active',
      fees: 1.5,
    },
    {
      customer: 'Brian Foster',
      bookTitle: 'Brave New World',
      checkoutDate: 'Mar. 29 2024',
      dueDate: 'Apr. 12 2024',
      status: 'Lost',
      fees: 15,
    },
    {
      customer: 'Emma Myers',
      bookTitle: 'To the Lighthouse',
      checkoutDate: 'May 5 2024',
      dueDate: 'Jun. 5 2024',
      status: 'Active',
      fees: 0,
    },
  ];

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
