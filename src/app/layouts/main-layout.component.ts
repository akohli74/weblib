import { Component, HostBinding } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "main-layout.component.html",
  styleUrl: "main-layout.component.scss"
})
export class MainLayoutComponent {
  title = 'Web Lib';

  // bind a CSS class on the host for dark mode
  @HostBinding('class.dark-theme') darkTheme = false;
  
  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
  }

  logout() {
    // clear auth...then redirect:
    localStorage.removeItem("token");
  }
}