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
    <section className="flex min-h-dvh flex-col items-center justify-center bg-brand-950 px-4 text-center text-white">
      <h1 className="text-3xl font-bold sm:text-4xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-white/70">{getErrorMessage(error)}</p>
      <Link
        to={ROUTES.home}
        className="mt-8 inline-flex h-11 items-center rounded-sm bg-brand-600 px-5 text-sm font-semibold transition-colors hover:bg-brand-500"
      >
        Back to movies
      </Link>
    </section>
  );
}
