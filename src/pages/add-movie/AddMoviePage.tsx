import { useNavigate } from 'react-router';

import CreateFilmForm from './CreateFilmForm';

import { ROUTES } from '@/app/routes';

export default function AddMoviePage() {
  const navigate = useNavigate();

  return (
    <section className="container py-8 sm:py-10">
      <div className="mx-auto max-w-lg">
        <header className="mb-6 border-l-4 border-brand-600 pl-3">
          <h1 className="text-3xl font-bold tracking-tight">Add a new movie</h1>
          <p className="mt-1 text-sm text-fg-muted">It will appear in the catalogue right away.</p>
        </header>
        <div className="border border-line p-5 sm:p-6">
          <CreateFilmForm onCreated={() => navigate(ROUTES.movies)} />
        </div>
      </div>
    </section>
  );
}
