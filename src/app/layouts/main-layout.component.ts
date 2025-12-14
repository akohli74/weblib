import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScanTransactionDialogComponent } from '../features/popups/scan-transaction-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WebLibService } from '../services/weblib.service';
import { UserResponse } from '../models/user';
import { EventingService } from '../services/eventing.service';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: "main-layout.component.html",
  styleUrl: "main-layout.component.scss"
})
export class MainLayoutComponent implements OnInit {
  hideNav = false;
  userName: string | undefined;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private dialog: MatDialog, private router: Router, 
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private webLib: WebLibService, private eventingService: EventingService) {}
  
  title = 'Web Lib';

  // bind a CSS class on the host for dark mode
  @HostBinding('class.dark-theme') darkTheme = false;
  
  ngOnInit(): void {
    const userId = localStorage.getItem("userId");
    if (userId) {
      this.webLib.getUsers().subscribe((users: UserResponse) => {
        const user = users.book.find(user => user.UserID === parseInt(userId));
        this.userName = user?.FirstName + ' ' + user?.LastName;
      });
    } else {
      this.router.navigate(['/auth']);
    }

    this.hideNav = this.isLoginUrl(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.hideNav = this.isLoginUrl(e.urlAfterRedirects);
      });

    this.eventingService.commands$
      .pipe(filter(c => c.type === 'LOGIN'))
      .subscribe(() => {
        this.hideNav = false;
    });

    this.eventingService.commands$
      .pipe(filter(c => c.type === 'LOGOUT'))
      .subscribe(() => {
        localStorage.removeItem("userId");
        this.hideNav = true;
        this.userName = '';
    });
  }

  private isLoginUrl(url: string): boolean {
    return url.includes('/auth');
  }

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
  }

  openScanPopup(): void {
    const ref = this.dialog.open(ScanTransactionDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (ok) {
        console.log('Transaction completed');
        // refresh list, show snackbar, etc.
      }
    });
  }

  logout() {
    // clear auth...then redirect:
    localStorage.removeItem("userId");
  }
}