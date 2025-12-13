// app/pages/library/library.component.ts
// app/pages/library/library.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebLibService } from '../../../services/weblib.service';
import { Book } from '../../../models/book'

type BookStatus = 'Available' | 'Checked Out' | 'Missing' | 'Overdue';

@Component({
  standalone: true,
  selector: 'app-library-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  searchTerm = '';
  statusFilter: BookStatus | 'All' = 'All';
  genreFilter: string | 'All' = 'All';
  books: Book[] = [];

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private webLib: WebLibService) {}

  ngOnInit() : void {
    this.webLib.getBooks().subscribe(bookResponse => this.books = bookResponse.books)
  }

  get filteredBooks(): Book[] {
    return this.books.filter((b) => {
      const matchesSearch =
        !this.searchTerm ||
        b.Title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        b.Author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        b.ISBN.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'All' || b.CheckedOut;

      const matchesGenre =
        this.genreFilter === 'All' ||
        b.Genre.toLowerCase() === this.genreFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesGenre;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = 'All';
    this.genreFilter = 'All';
  }
}
