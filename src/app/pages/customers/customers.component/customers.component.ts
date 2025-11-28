// app/pages/customers/customers.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-customers-page',
  imports: [MatCardModule],
  templateUrl: 'customers.component.html'
})
export class CustomersComponent {}