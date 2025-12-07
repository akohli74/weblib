export interface Book {
  BookID: number;
  Title: string;
  Genre: string;
  Author: string;
  ISBN: string;
  NumberOfPages: number;
  PublicationDate: string;
  CheckedOut: number;  // 1 or 0
  Late: number;        // 1 or 0
  Missing: number;     // 1 or 0
  CurrentTransactionID: number;
}

export interface BookResponse {
  books: Book[];
  status: number;
}