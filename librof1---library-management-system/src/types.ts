export type BookStatus = "Available" | "Reserved" | "On Loan";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: BookStatus;
  year: number;
  imageUrl?: string;
}

export type UserRole = "Student" | "Employee" | "Admin";

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  joinedDate: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  joinedDate: string;
}

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "Issued" | "Returned" | "Overdue";
  fine: number;
}
