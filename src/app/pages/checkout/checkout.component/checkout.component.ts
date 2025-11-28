// app/pages/checkout/checkout.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [MatCardModule],
  templateUrl: 'checkout.component.html'
})
export class CheckoutComponent {}