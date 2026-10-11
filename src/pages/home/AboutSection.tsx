import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';
import { useGenres, useMoviesStore } from '@/store/movies.store';

const TEAM = [
  { name: 'Olena Kovalenko', role: 'Founder & Curator' },
  { name: 'Taras Melnyk', role: 'Frontend Engineer' },
  { name: 'Iryna Bondar', role: 'Product Designer' },
  { name: 'Andrii Shevchuk', role: 'Film Critic' },
];

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('');

export default function AboutSection() {
  const moviesCount = useMoviesStore((s) => s.movies.length);
  const genresCount = useGenres().length;

  const stats = [
    { value: `${moviesCount}+`, label: 'Curated films' },
    { value: genresCount, label: 'Genres' },
    { value: TEAM.length, label: 'People in the team' },
  ];

  return (
    <section
      aria-labelledby="about-title"
      className="relative overflow-hidden border-b border-line bg-surface-muted"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full bg-brand-500/15 blur-3xl"
      />
      <div className="relative container grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest text-brand-600 uppercase dark:text-brand-400">
            Who we are
          </p>
          <h1
            id="about-title"
            className="mt-3 text-4xl leading-tight font-black tracking-tight sm:text-5xl"
          >
            A small team that <span className="text-brand-600 dark:text-brand-400">lives</span> for
            movies
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
            Film started as a shared spreadsheet between friends arguing about what to watch on
            Friday night. Today it is a hand-picked catalogue that helps you discover great cinema
            without endless scrolling.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={ROUTES.movies}
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
            >
              Browse catalogue
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              to={ROUTES.addMovie}
              className="inline-flex h-11 items-center rounded-sm border border-line bg-surface-raised px-5 text-sm font-semibold transition-colors hover:border-brand-500"
            >
              Suggest a movie
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt className="text-xs text-fg-muted">{label}</dt>
                <dd className="mt-1 text-3xl font-black tracking-tight">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4">
          {TEAM.map(({ name, role }) => (
            <li
              key={name}
              className="flex flex-col gap-4 border border-line bg-surface-raised p-4 transition-colors hover:border-brand-500 sm:p-5"
            >
              <span
                aria-hidden
                className="flex size-12 items-center justify-center rounded-sm bg-linear-to-br from-brand-500 to-brand-800 text-sm font-bold text-white"
              >
                {initials(name)}
              </span>
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-fg-muted">{role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
