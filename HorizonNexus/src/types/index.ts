// Define user roles
export type UserRole = 'admin' | 'teacher' | 'student';

// Define the structure of a user profile stored in Firestore
export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

// Define the structure of an Announcement object
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  tags?: string[]; // Added for tagging
}

// Define the structure of an Assignment object
export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  tags?: string[]; // Added for tagging
}