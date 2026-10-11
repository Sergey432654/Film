import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

import { ROUTES } from '@/app/routes';

function getErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <section className="p-8 text-center">
      <h1 className="mb-4 text-4xl font-bold">Something went wrong</h1>
      <p className="mb-6 text-red-400">{getErrorMessage(error)}</p>
      <Link to={ROUTES.home} className="text-purple-400 hover:underline">
        Back to movies
      </Link>
    </section>
  );
}
