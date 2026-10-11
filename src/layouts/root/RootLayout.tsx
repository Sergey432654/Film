import { Outlet } from 'react-router';

import Footer from './Footer';
import Header from './Header';

export default function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="container flex-1 py-8 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
