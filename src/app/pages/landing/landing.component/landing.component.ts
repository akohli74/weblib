// app/pages/landing/landing.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HamburgerMenuComponent } from "./hamburger-menu/hamburger-menu.component";
import { MatIcon } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: 'app-landing-page',
  imports: [MatCardModule, CommonModule, HamburgerMenuComponent, MatIcon],
  templateUrl: 'landing.component.html',
  styleUrl: 'landing.component.scss'
})
export class LandingComponent {
  items = [
    {
     title: 'All Books',
     description: '1054',
     buttonText: 'View Books',
     buttonClass: 'all-books-btn',
     icon: 'book',
     class: 'all-books'
    }, 
    { 
      title: 'All Customers',
      description: '2402',
      buttonText: 'View Customers',
      buttonClass: 'all-customers-btn',
      icon: 'person',
      class: 'all-customers'
    }, 
    { 
      title: 'Check Outs',
      description: '74',
      buttonText: 'View Checkouts',
      buttonClass: 'checkouts-btn',
      icon: 'book',
      class: 'checkouts'

    }, 
    { 
      title: 'Late Fees',
      description: '$254',
      buttonText: 'View Customers',
      buttonClass: 'latefees-btn',
      icon: 'dollar',
      class: 'latefees'
    } 
  ]
}