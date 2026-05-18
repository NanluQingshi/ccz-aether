import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '博客' },
  { to: '/ai', label: 'AI' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/issues', label: 'Issue Bin' },
  { to: '/musings', label: '随想录' },
  { to: '/books', label: '书页间' },
  { to: '/about', label: '关于' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">南路志</Link>
          <span className="navbar-motto">敛翼三秋，以飞云霄</span>
        </div>

        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};
