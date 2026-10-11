import type { ReactNode } from 'react';

interface Props {
  eyebrow: string;
  title: string;
  id?: string;
  action?: ReactNode;
}

export default function SectionHeading({ eyebrow, title, id, action }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="border-l-4 border-brand-600 pl-3">
        <p className="text-xs font-semibold tracking-widest text-brand-600 uppercase dark:text-brand-400">
          {eyebrow}
        </p>
        <h2 id={id} className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
