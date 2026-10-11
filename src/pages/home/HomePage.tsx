import AboutSection from './AboutSection';
import GenresSection from './GenresSection';
import NewsletterSection from './NewsletterSection';
import TopMoviesCarousel from './TopMoviesCarousel';

export default function HomePage() {
  return (
    <>
      <AboutSection />
      <TopMoviesCarousel />
      <GenresSection />
      <NewsletterSection />
    </>
  );
}
