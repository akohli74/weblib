// app/pages/library/library.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-library-page',
  imports: [MatCardModule],
  templateUrl: 'library.component.html'
})
export class LibraryComponent {}