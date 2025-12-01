import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-hamburger-menu',
  imports: [NgForOf, RouterLink, CommonModule],
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss']
})
export class HamburgerMenuComponent {
  isOpen = false;

  // Example menu items – update to match your routes
  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'book' },
    { label: 'Book Library', route: '/library' },
    { label: 'Customers', route: '/customers' },
    { label: 'Checkouts', route: '/checkout' },
    { label: 'Alerts', route: '/alerts' },
  ];

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private host: ElementRef<HTMLElement>) {}

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  // Close when clicking outside of this component
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.host.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }
}