// app/pages/customers/customers.component.ts
// app/pages/customers/customers.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebLibService } from '../../../services/weblib.service';
import { User } from '../../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerDialogComponent, CreateUserInput } from './popup/add-customer-dialog.component';
import { CustomerDetailDialogComponent } from './popup/customer-detail-dialog.component';

type CustomerStatus = 'Active' | 'Inactive';

@Component({
  standalone: true,
  selector: 'app-customers-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private webLib: WebLibService, private dialog: MatDialog) {}

  searchText = '';
  statusFilter: CustomerStatus | 'All' = 'All';

  customers: User[] = [];

  ngOnInit(): void {
    this.webLib.getUsers().subscribe(userResponse => {
      this.customers = userResponse.book;
    })
  }

  openAddCustomer(): void {
    const ref = this.dialog.open(AddCustomerDialogComponent, {
      width: '720px',
      maxWidth: '95vw',
    });

    ref.afterClosed().subscribe((result?: CreateUserInput) => {
      if (!result) return;

      this.webLib.addCustomer(result).subscribe(() => {
        this.webLib.getUsers().subscribe(userResponse => {
          this.customers = userResponse.book;
        }
      );
    });
  })}

  onSearch(): void {
      const term = (this.searchText ?? '').trim().toLowerCase();
      if (!term) return;
  
      // Match on Title / Author / ISBN (and exact BookID if user types a number)
      const asNumber = Number(term);
      const match = this.customers.find(b =>
        (b.FirstName ?? '').toLowerCase().includes(term) ||
        (b.LastName ?? '').toLowerCase().includes(term) ||
        (b.Email ?? '').toLowerCase().includes(term) ||
        (!Number.isNaN(asNumber) && b.UserID === asNumber)
      );
  
      if (!match) {
        // You can swap this for a snackbar later
        console.warn('No matching book found for:', term);
        return;
      }
  
      this.dialog.open(CustomerDetailDialogComponent, {
        width: '720px',
        maxWidth: '95vw',
        data: match
      });
  }

  get filteredCustomers(): User[] {
    return this.customers.filter(c => {
      const matchesSearch =
        !this.searchText ||
        c.FirstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        c.Email.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'All' || c.Status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters() {
    this.searchText = '';
    this.statusFilter = 'All';
  }
}

