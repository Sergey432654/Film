import { createBrowserRouter } from 'react-router';

import { ROUTES } from '@/app/routes';
import RootLayout from '@/layouts/RootLayout';
import AddMoviePage from '@/pages/AddMoviePage';
import ErrorPage from '@/pages/ErrorPage';
import MoviesPage from '@/pages/MoviesPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: MoviesPage },
      { path: ROUTES.addMovie, Component: AddMoviePage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
