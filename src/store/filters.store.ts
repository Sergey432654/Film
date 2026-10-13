import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { env } from '@/config/env';

interface FiltersState {
  searchTerm: string;
  selectedGenre: string | null;
}

interface FiltersActions {
  setSearchTerm: (searchTerm: string) => void;
  setGenre: (genre: string | null) => void;
  toggleGenre: (genre: string) => void;
  browseGenre: (genre: string) => void;
  resetFilters: () => void;
}

export type FiltersStore = FiltersState & FiltersActions;

const initialState: FiltersState = { searchTerm: '', selectedGenre: null };

export const useFiltersStore = create<FiltersStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setSearchTerm: (searchTerm) => set({ searchTerm }, undefined, 'filters/search'),
      setGenre: (selectedGenre) => set({ selectedGenre }, undefined, 'filters/setGenre'),
      toggleGenre: (genre) =>
        set(
          (state) => ({ selectedGenre: state.selectedGenre === genre ? null : genre }),
          undefined,
          'filters/toggleGenre',
        ),
      browseGenre: (genre) =>
        set({ selectedGenre: genre, searchTerm: '' }, undefined, 'filters/browseGenre'),
      resetFilters: () => set(initialState, undefined, 'filters/reset'),
    }),
    { name: 'filters', enabled: env.isDev },
  ),
);
