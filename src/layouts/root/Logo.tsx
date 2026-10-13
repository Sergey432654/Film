import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
  onClick?: () => void;
}

export default function Logo({ className, onClick }: Props) {
  return (
    <Link
      to={ROUTES.home}
      onClick={onClick}
      aria-label="Film — home"
      className={cn('inline-flex shrink-0 items-center', className)}
    >
      <span className="rounded-xs bg-brand-600 px-2 py-0.5 text-xl font-black tracking-tight text-white uppercase">
        Film
      </span>
    </Link>
  );
}
