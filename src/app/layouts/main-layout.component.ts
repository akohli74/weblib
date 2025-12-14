import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
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
export class MainLayoutComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private dialog: MatDialog, private router: Router, 
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private webLib: WebLibService, private eventingService: EventingService) {}
  
  title = 'Web Lib';
  userName: string | undefined;

  // bind a CSS class on the host for dark mode
  @HostBinding('class.dark-theme') darkTheme = false;
  
ngOnInit(): void {
  const userId = localStorage.getItem("userId");
  if (userId) {
    this.webLib.getUsers().subscribe((users: UserResponse) => {
      // check if the user is logged in
      const user = users.book.find(user => user.UserID === parseInt(userId));
      this.userName = user?.FirstName + ' ' + user?.LastName;
    });
  } else {
    // user is not logged in, redirect to login page
    this.router.navigate(['/auth']);
  }

  this.eventingService.commands$
    .pipe(filter(c => c.type === 'LOGOUT'))
    .subscribe(() => {
      localStorage.removeItem("userId");
      this.userName = '';
  });
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