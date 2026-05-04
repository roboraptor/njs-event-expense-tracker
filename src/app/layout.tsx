import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <div className="container">
            <Link href="/" className="navbar-brand mb-0 h1">Group Expense Tracker</Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link href="/" className="nav-link">Log</Link>
                </li>
                <li className="nav-item">
                  <Link href="/add" className="nav-link">Add Records</Link>
                </li>
                <li className="nav-item">
                  <Link href="/settlements" className="nav-link">Calculations</Link>
                </li>
                <li className="nav-item">
                  <Link href="/settings" className="nav-link">Settings</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
