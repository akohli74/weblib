export interface Activity {
  member: string;
  activity: string;  // e.g., "Checked out", "Returned"
  book: string;
  date: Date;
}