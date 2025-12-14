import { Component, HostBinding } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScanTransactionDialogComponent } from '../features/popups/scan-transaction-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private dialog: MatDialog) {}
  
  title = 'Web Lib';

  // bind a CSS class on the host for dark mode
  @HostBinding('class.dark-theme') darkTheme = false;
  
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
    localStorage.removeItem("token");
  }
}