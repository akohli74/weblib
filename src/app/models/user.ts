export interface User {
  UserID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Joined: string;   // ISO date string
  Fees: number;
  isGuest: number;  // 0 or 1
  Status: string;
}

export interface UserResponse {
  status: number,
  book: User[]
}