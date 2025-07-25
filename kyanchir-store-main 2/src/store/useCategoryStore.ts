import { create } from 'zustand';

interface CategoryState {
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: 'all',
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
}));