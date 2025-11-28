// app/pages/library/library.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-library-page',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-title>Library</mat-card-title>
      <mat-card-content>
        <p>Welcome to Web Lib.</p>
      </mat-card-content>
    </mat-card>
  `
})
export class LibraryComponent {}