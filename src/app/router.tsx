import { createBrowserRouter } from 'react-router';

import { ROUTES } from '@/app/routes';
import RootLayout from '@/layouts/root/RootLayout';
import AddMoviePage from '@/pages/add-movie/AddMoviePage';
import ErrorPage from '@/pages/error/ErrorPage';
import HomePage from '@/pages/home/HomePage';
import MoviesPage from '@/pages/movies/MoviesPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: HomePage },
      { path: ROUTES.movies, Component: MoviesPage },
      { path: ROUTES.addMovie, Component: AddMoviePage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
