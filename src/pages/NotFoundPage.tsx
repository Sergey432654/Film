import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';

export default function NotFoundPage() {
  return (
    <section className="text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-6">Page not found</p>
      <Link to={ROUTES.home} className="text-purple-400 hover:underline">
        Back to movies
      </Link>
    </section>
  );
}
