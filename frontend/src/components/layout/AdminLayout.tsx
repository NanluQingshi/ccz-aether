import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const sideLinks = [
  { to: '/admin/dashboard', label: '仪表盘', icon: '◈' },
  { to: '/admin/posts', label: '文章管理', icon: '≡' },
  { to: '/admin/posts/new', label: '写新文章', icon: '+' },
];

export const AdminLayout: React.FC = () => {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="logo-bracket">&lt;</span>Admin<span className="logo-bracket">/&gt;</span>
        </div>
        <nav className="admin-nav">
          {sideLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/admin/dashboard'}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span className="admin-username">{username}</span>
          <button className="admin-logout-btn" onClick={handleLogout}>退出</button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};
