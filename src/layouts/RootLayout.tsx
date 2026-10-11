import { Outlet } from 'react-router';

import Header from '@/components/Header';

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
