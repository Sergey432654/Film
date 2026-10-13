import { ROUTES } from '@/app/routes';

export const NAV_ITEMS = [
  { to: ROUTES.home, label: 'Home' },
  { to: ROUTES.movies, label: 'Movies' },
  { to: ROUTES.addMovie, label: 'Add movie' },
] as const;
