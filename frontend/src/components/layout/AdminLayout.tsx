import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const AdminLayout: React.FC = () => {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isPostsActive = location.pathname.startsWith('/admin/posts');

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="logo-bracket">&lt;</span>Admin<span className="logo-bracket">/&gt;</span>
        </div>
        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">◈</span>仪表盘
          </NavLink>
          <NavLink
            to="/admin/posts"
            className={`admin-nav-link ${isPostsActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">≡</span>文章管理
          </NavLink>
          <NavLink
            to="/admin/posts/new"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">+</span>写新文章
          </NavLink>
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
