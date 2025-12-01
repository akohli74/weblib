// app/pages/customers/customers.component.ts
// app/pages/customers/customers.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CustomerStatus = 'Active' | 'Inactive';

interface Customer {
  name: string;
  email: string;
  joined: string;   // e.g. "May 2024"
  status: CustomerStatus;
}

@Component({
  standalone: true,
  selector: 'app-customers-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent {
  searchTerm = '';
  statusFilter: CustomerStatus | 'All' = 'All';

  customers: Customer[] = [
    { name: 'Jaden Becker',   email: 'becker.becker.om',     joined: 'May 2024', status: 'Active' },
    { name: 'Amanda Perkins', email: 'perkins.amanda.esu',   joined: 'May 2020', status: 'Active' },
    { name: 'Melody Carter',  email: 'carter@tye.ecu',       joined: 'May 2022', status: 'Active' },
    { name: 'Tyler Alexander',email: 'carter@adam.edu',      joined: 'May 2020', status: 'Inactive' },
    { name: 'Joseph Dixon',   email: 'dixon@tyler.edu',      joined: 'May 1929', status: 'Active' },
    { name: 'Felicia Porter', email: 'porter@felicia.ams',   joined: 'May 1928', status: 'Active' },
    { name: 'Nolan Hayes',    email: 'hayes@ethan.patel',    joined: 'May 2023', status: 'Inactive' },
    { name: 'Christina James',email: 'james@ethan.patel',    joined: 'May 1024', status: 'Active' },
  ];

  get filteredCustomers(): Customer[] {
    return this.customers.filter(c => {
      const matchesSearch =
        !this.searchTerm ||
        c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'All' || c.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = 'All';
  }
}
