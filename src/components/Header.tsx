import { NavLink } from 'react-router';
import { twMerge } from 'tailwind-merge';

import { ROUTES } from '@/app/routes';
import logo from '@/assets/bird.png';

const NAV_ITEMS = [
  { to: ROUTES.home, label: 'Movies' },
  { to: ROUTES.addMovie, label: 'Add movie' },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-black px-4 py-3">
      <NavLink to={ROUTES.home}>
        <img className="size-16" src={logo} alt="Film logo" />
      </NavLink>
      <nav className="flex gap-4">
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              twMerge(
                'text-zinc-300 transition-colors hover:text-white',
                isActive && 'text-purple-400',
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
