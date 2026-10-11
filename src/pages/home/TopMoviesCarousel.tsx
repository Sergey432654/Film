import { ChevronLeft, ChevronRight, Film, Star } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';
import { useTopMovies } from '@/store/movies.store';
import type { Movie } from '@/types/movie';

import SectionHeading from './SectionHeading';

function TopMovieCard({ movie, rank }: { movie: Movie; rank: number }) {
  return (
    <article className="group">
      <div className="relative flex aspect-2/3 items-center justify-center overflow-hidden rounded-sm bg-linear-to-br from-brand-600 via-brand-900 to-brand-950 ring-1 ring-black/5 transition group-hover:ring-2 group-hover:ring-brand-500">
        <Film
          aria-hidden
          className="size-12 text-white/20 transition-transform duration-300 group-hover:scale-110"
        />
        <span className="absolute bottom-1 left-2 text-6xl leading-none font-black text-white/90 [text-shadow:0_2px_12px_rgb(0_0_0/0.5)]">
          {rank}
        </span>
        {movie.rating && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-xs bg-black/50 px-1.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Star aria-hidden className="size-3 fill-amber-400 text-amber-400" />
            {movie.rating.toFixed(1)}
          </span>
        )}
      </div>
      <h3 className="mt-3 line-clamp-1 font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
        {movie.title}
      </h3>
      <p className="text-sm text-fg-muted">
        {[movie.year, movie.genre].filter(Boolean).join(' · ')}
      </p>
    </article>
  );
}

const arrowClass =
  'inline-flex size-10 items-center justify-center rounded-sm border border-line bg-surface-raised transition-colors hover:border-brand-500 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40 dark:hover:text-brand-400';

export default function TopMoviesCarousel() {
  const movies = useTopMovies(10);
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    el?.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="top-title" className="py-14 sm:py-20">
      <div className="container">
        <SectionHeading
          id="top-title"
          eyebrow="Editor’s choice"
          title="Top 10 movies"
          action={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={atStart}
                aria-label="Previous movies"
                className={arrowClass}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={atEnd}
                aria-label="Next movies"
                className={arrowClass}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          }
        />

        <ul
          ref={trackRef}
          onScroll={updateEdges}
          aria-label="Top rated movies"
          className="-mx-4 no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 sm:mx-0 sm:scroll-px-0 sm:px-0"
        >
          {movies.map((movie, index) => (
            <li
              key={movie.id}
              className={cn(
                'shrink-0 snap-start',
                'basis-[calc((100%-1rem)/2)] sm:basis-[calc((100%-2rem)/3)] md:basis-[calc((100%-3rem)/4)] lg:basis-[calc((100%-4rem)/5)]',
              )}
            >
              <TopMovieCard movie={movie} rank={index + 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
