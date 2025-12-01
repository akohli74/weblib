// app/pages/library/library.component.ts
// app/pages/library/library.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type BookStatus = 'Available' | 'Checked Out' | 'Missing' | 'Overdue';

interface Book {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  status: BookStatus;
}

@Component({
  standalone: true,
  selector: 'app-library-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent {
  searchTerm = '';
  statusFilter: BookStatus | 'All' = 'All';
  genreFilter: string | 'All' = 'All';

  books: Book[] = [
    {
      title: 'The Great Gatsby',
      author: 'E. Scott Fitzgerald',
      isbn: '9780443773655',
      genre: 'Fiction',
      status: 'Available',
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9762388944',
      genre: 'Fiction',
      status: 'Checked Out',
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: 'HB0873',
      genre: 'Fiction',
      status: 'Missing',
    },
    {
      title: 'Moby-Dick',
      author: 'Herman Melville',
      isbn: 'H51052',
      genre: 'Fiction',
      status: 'Available',
    },
  ];

  get filteredBooks(): Book[] {
    return this.books.filter((b) => {
      const matchesSearch =
        !this.searchTerm ||
        b.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        b.isbn.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'All' || b.status === this.statusFilter;

      const matchesGenre =
        this.genreFilter === 'All' ||
        b.genre.toLowerCase() === this.genreFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesGenre;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = 'All';
    this.genreFilter = 'All';
  }
}
