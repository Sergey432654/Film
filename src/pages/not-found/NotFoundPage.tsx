import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';

export default function NotFoundPage() {
  return (
    <section className="container flex flex-col items-center py-20 text-center">
      <p className="text-7xl font-black text-brand-600 sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-fg-muted">The page you are looking for doesn’t exist.</p>
      <Link
        to={ROUTES.movies}
        className="mt-8 inline-flex h-11 items-center rounded-sm bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
      >
        Back to movies
      </Link>
    </section>
  );
}
