import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Book } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (book: Book) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === book.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...book, quantity: 1 }],
          });
        }

        const newTotal = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        set({ total: newTotal });
      },

      removeItem: (bookId: string) => {
        set({
          items: get().items.filter(item => item.id !== bookId),
        });
        const newTotal = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        set({ total: newTotal });
      },

      updateQuantity: (bookId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === bookId ? { ...item, quantity } : item
          ),
        });
        const newTotal = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        set({ total: newTotal });
      },

      clearCart: () => {
        set({ items: [], total: 0 });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
