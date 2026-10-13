import { CheckCircle2, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { cn } from '@/lib/cn';

interface NewsletterForm {
  email: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterForm>();

  const onSubmit: SubmitHandler<NewsletterForm> = () => {
    setSubscribed(true);
    reset();
  };

  return (
    <section aria-labelledby="newsletter-title" className="py-14 sm:py-20">
      <div className="container">
        <div className="relative overflow-hidden bg-brand-600 px-6 py-10 text-white sm:px-10 sm:py-12 dark:bg-brand-700">
          <Mail
            aria-hidden
            className="pointer-events-none absolute -right-6 -bottom-8 size-48 rotate-12 text-white/10"
          />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 id="newsletter-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
                Never miss a great movie
              </h2>
              <p className="mt-3 max-w-md text-white/80">
                One email a month with new additions, hidden gems and the team’s picks. No spam,
                unsubscribe anytime.
              </p>
            </div>

            {subscribed ? (
              <div role="status" className="flex items-start gap-3 bg-white/10 p-4">
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0" />
                <p>
                  Thanks for your interest! Subscriptions aren’t live yet — we’ll launch the
                  newsletter soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'newsletter-error' : undefined}
                    className={cn(
                      'h-12 w-full flex-1 rounded-sm border-2 bg-white px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none',
                      errors.email ? 'border-red-400' : 'border-transparent focus:border-brand-950',
                    )}
                    {...register('email', {
                      required: 'Please enter your email',
                      pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email' },
                    })}
                  />
                  <button
                    type="submit"
                    className="h-12 shrink-0 rounded-sm bg-brand-950 px-6 font-semibold text-white transition-colors hover:bg-brand-900"
                  >
                    Subscribe
                  </button>
                </div>
                {errors.email && (
                  <p id="newsletter-error" className="mt-2 text-sm font-medium text-red-100">
                    {errors.email.message}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
