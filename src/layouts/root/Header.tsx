import { Menu, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';

import HeaderSearch from './HeaderSearch';
import Logo from './Logo';
import { NAV_ITEMS } from './navigation';
import ThemeToggle from './ThemeToggle';

import { ROUTES } from '@/app/routes';
import { cn } from '@/lib/cn';

const DESKTOP_QUERY = '(min-width: 64rem)';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeAll = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;

    const media = window.matchMedia(DESKTOP_QUERY);
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && closeAll();
    const onMediaChange = (e: MediaQueryListEvent) => e.matches && closeAll();

    document.addEventListener('keydown', onKeyDown);
    media.addEventListener('change', onMediaChange);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      media.removeEventListener('change', onMediaChange);
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-chrome/95 text-white backdrop-blur supports-backdrop-filter:bg-chrome/85">
      <div className="container flex h-16 items-center gap-3 lg:gap-6">
        <button
          type="button"
          onClick={() => {
            setMenuOpen((v) => !v);
            setSearchOpen(false);
          }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="-ml-2 p-2 text-white/80 hover:text-white lg:hidden"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        <Logo onClick={closeAll} />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  'relative px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white',
                  'after:absolute after:inset-x-3 after:-bottom-3.5 after:h-0.5 after:bg-transparent after:transition-colors',
                  isActive && 'text-white after:bg-brand-400',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <HeaderSearch className="ml-auto hidden max-w-md md:block" />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((v) => !v);
              setMenuOpen(false);
            }}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            className="p-2 text-white/80 hover:text-white md:hidden"
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </button>

          <ThemeToggle className="mr-1" />

          <Link
            to={ROUTES.addMovie}
            onClick={closeAll}
            className="inline-flex h-10 items-center gap-1.5 rounded-sm bg-brand-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 sm:px-4"
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">Add movie</span>
            <span className="sr-only sm:hidden">Add movie</span>
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/10 py-3 md:hidden">
          <div className="container">
            <HeaderSearch autoFocus onSubmitted={closeAll} />
          </div>
        </div>
      )}

      {menuOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={closeAll}
            className="absolute inset-0 bg-black/60"
          />
          <nav
            aria-label="Mobile"
            className="relative animate-fade-in border-b border-white/10 bg-chrome py-2"
          >
            <ul className="container">
              {NAV_ITEMS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end
                    onClick={closeAll}
                    className={({ isActive }) =>
                      cn(
                        'block border-l-2 border-transparent px-3 py-3 text-base font-medium text-white/75 hover:bg-white/5 hover:text-white',
                        isActive && 'border-brand-400 bg-white/5 text-white',
                      )
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
