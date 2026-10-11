import { Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/cn';
import { useThemeStore } from '@/store/theme.store';

interface Props {
  className?: string;
}

export default function ThemeToggle({ className }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
      className={cn('p-2 text-white/80 transition-colors hover:text-white', className)}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
