export type UserRole = 'admin' | 'publisher' | 'school';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'pending' | 'approved' | 'rejected';
  organizationName?: string;
  documentUrl?: string;
  profileImage?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData | FormData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  organizationName?: string;
  phone?: string;
  address?: string;
  verificationDocument?: File;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  grade: string;
  subject: string;
  isbn: string;
  price: number;
  publisherId: string;
  publisherName: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  schoolId: string;
  schoolName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  bookId: string;
  bookTitle: string;
  quantity: number;
  price: number;
}

export interface LessonProgress {
  id: string;
  schoolId: string;
  bookId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  updatedAt: string;
}

export interface Activity {
  id: string;
  schoolId: string;
  bookId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: string;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface ProgressEntry {
  id: string;
  schoolId?: string;
  schoolName?: string;
  bookId: string;
  bookTitle: string;
  status: 'not-started' | 'in-progress' | 'completed';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackEntry {
  id: string;
  schoolId: string;
  schoolName: string;
  publisherId: string;
  publisherName: string;
  message: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'approval' | 'status_change' | 'payment' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
