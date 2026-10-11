import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router';

import { ROUTES } from '@/app/routes';
import RootLayout from '@/layouts/root/RootLayout';
import ErrorPage from '@/pages/error/ErrorPage';
import PageLoader from '@/ui/PageLoader';

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    HydrateFallback: PageLoader,
    children: [
      { index: true, lazy: page(() => import('@/pages/home/HomePage')) },
      { path: ROUTES.movies, lazy: page(() => import('@/pages/movies/MoviesPage')) },
      { path: ROUTES.addMovie, lazy: page(() => import('@/pages/add-movie/AddMoviePage')) },
      { path: '*', lazy: page(() => import('@/pages/not-found/NotFoundPage')) },
    ],
  },
]);
