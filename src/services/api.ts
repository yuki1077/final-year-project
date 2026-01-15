import axios from 'axios';
import { RegisterData } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const { state } = JSON.parse(authData);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      // Only redirect to login if not on a public route
      const publicRoutes = ['/', '/about', '/services', '/register', '/login'];
      const currentPath = window.location.pathname;
      const isPublicRoute = publicRoutes.some(route => {
        if (route === '/') {
          return currentPath === '/';
        }
        return currentPath === route || currentPath.startsWith(route + '/');
      });
      
      if (!isPublicRoute) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData | FormData) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await apiClient.post('/auth/register', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export const booksApi = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/books', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await apiClient.post('/books', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  update: async (id: string, data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await apiClient.put(`/books/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  },
};

export const ordersApi = {
  getAll: async () => {
    const response = await apiClient.get("/orders");
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },

  updateStatus: async (id: string, status: string, paymentStatus?: string) => {
    const response = await apiClient.patch(`/orders/${id}`, { status, paymentStatus });
    return response.data;
  },
};

export const usersApi = {
  getAll: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  getPublishers: async () => {
    const response = await apiClient.get("/users/publishers");
    return response.data;
  },

  getPublishersPublic: async () => {
    const response = await apiClient.get("/users/publishers/public");
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const response = await apiClient.post('/users/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export const paymentsApi = {
  createIntent: async (amount: number) => {
    const response = await apiClient.post('/payments/intent', { amount });
    return response.data;
  },
  
  createEsewaPayment: async (amount: number, orderId: string, items: any[]) => {
    const response = await apiClient.post('/payments/esewa/create', { 
      amount, 
      orderId,
      items 
    });
    return response.data;
  },
};

export const progressApi = {
  getAll: async () => {
    const response = await apiClient.get('/progress');
    return response.data;
  },
  getByPublisher: async () => {
    const response = await apiClient.get('/progress/publisher');
    return response.data;
  },
  create: async (data: { bookId: string; bookTitle: string; status: string; description?: string }) => {
    const response = await apiClient.post('/progress', data);
    return response.data;
  },
  update: async (id: string, data: { status?: string; description?: string }) => {
    const response = await apiClient.put(`/progress/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await apiClient.delete(`/progress/${id}`);
    return response.data;
  },
};

export const feedbackApi = {
  create: async (data: { publisherId: string; publisherName: string; message: string }) => {
    const response = await apiClient.post('/feedback', data);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/feedback');
    return response.data;
  },
};

export const activitiesApi = {
  create: async (data: FormData) => {
    const response = await apiClient.post('/activities', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getByBook: async (bookId: string) => {
    const response = await apiClient.get(`/activities/book/${bookId}`);
    return response.data;
  },
};

export const notificationsApi = {
  getAll: async (limit?: number) => {
    const response = await apiClient.get('/notifications', { params: { limit } });
    return response.data;
  },
  
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },
  
  markAsRead: async (id: string) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default apiClient;
