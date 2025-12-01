// app/pages/dashboard/dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HamburgerMenuComponent } from "./hamburger-menu/hamburger-menu.component";
import { MatIcon } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [MatCardModule, CommonModule, HamburgerMenuComponent, MatIcon],
  templateUrl: 'dashboard.component.html',
  styleUrl: 'dashboard.component.scss'
})
export class DashboardComponent {
  items = [
    {
     title: 'Checkouts',
     description: '74',
     buttonText: 'View Checkouts',
     buttonClass: 'view-checkouts-btn',
     icon: 'book',
     class: 'checkouts'
    }, 
    { 
      title: 'Late Fees',
      description: '$254',
      buttonText: 'View Customers',
      buttonClass: 'latefees-btn',
      icon: 'attach_money',
      class: 'latefees'
    },
    { 
      title: 'Overdues',
      description: '7',
      buttonText: 'View Customers',
      buttonClass: 'overdues-btn',
      icon: 'warning',
      class: 'overdues'

    },
    { 
      title: 'All Customers',
      description: '2402',
      buttonText: 'View Customers',
      buttonClass: 'all-customers-btn',
      icon: 'person',
      class: 'all-customers'
    }
  ]
}