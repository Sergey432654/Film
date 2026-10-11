import { useNavigate } from 'react-router';

import { ROUTES } from '@/app/routes';
import { CreateFilmForm } from '@/components/CreateFilmForm';

export default function AddMoviePage() {
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="mb-10 text-4xl font-bold">Add a new movie</h1>
      <CreateFilmForm onCreated={() => navigate(ROUTES.home)} />
    </section>
  );
}
