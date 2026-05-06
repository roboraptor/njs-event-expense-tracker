'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link href="/" className="navbar-brand mb-0 h1" onClick={closeMenu}>
          Group Expense Tracker
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div 
          className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} 
          id="navbarNav"
          style={isOpen ? { display: 'block' } : {}}
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link" onClick={closeMenu}>Log</Link>
            </li>
            <li className="nav-item">
              <Link href="/add" className="nav-link" onClick={closeMenu}>Add Records</Link>
            </li>
            <li className="nav-item">
              <Link href="/settlements" className="nav-link" onClick={closeMenu}>Calculations</Link>
            </li>
            <li className="nav-item">
              <Link href="/settings" className="nav-link" onClick={closeMenu}>Settings</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
