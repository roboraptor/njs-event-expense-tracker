import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Event Expense Tracker',
  description: 'Track group expenses and calculate who owes whom.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
