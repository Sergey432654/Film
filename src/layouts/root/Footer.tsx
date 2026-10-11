import { Link } from 'react-router';

import Logo from './Logo';
import { NAV_ITEMS } from './navigation';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-brand-950 text-white/70">
      <div className="container grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed">
            Your personal movie catalogue. Browse, search and keep track of the films you love.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-3 text-xs font-semibold tracking-wider text-white uppercase">Browse</h2>
          <ul className="space-y-2 text-sm">
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Film. All rights reserved.</p>
          <p className="text-white/50">Made with React &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
