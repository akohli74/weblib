// app/pages/customers/customers.component.ts
// app/pages/customers/customers.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebLibService } from '../../../services/weblib.service';
import { User } from '../../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerDialogComponent, CreateUserInput } from './popup/add-customer-dialog.component';

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

  searchTerm = '';
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

  get filteredCustomers(): User[] {
    return this.customers.filter(c => {
      const matchesSearch =
        !this.searchTerm ||
        c.FirstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.Email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'All' || c.Status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = 'All';
  }
}

