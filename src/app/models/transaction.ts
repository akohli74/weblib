export interface Transaction {
  TransactionID: number;
  UserID: number;
  BookID: number;
  LastAction: "CHECKEDIN" | "CHECKEDOUT";
  CheckOutDate: string | null;
  DueDate: string | null;
  CheckInDate: string | null;
  Note: string;
}

export interface TransactionResponse {
  status: number;
  book: Transaction[];
}