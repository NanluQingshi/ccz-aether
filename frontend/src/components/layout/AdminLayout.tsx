import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout as apiLogout } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';

export const AdminLayout: React.FC = () => {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useUiStore();

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {
      // ignore errors — clear local state regardless
    }
    logout();
    addToast('已退出登录', 'info');
    navigate('/admin/login');
  };

  const path = location.pathname;
  const isEditorActive = path === '/admin/posts/new' || /^\/admin\/posts\/\d+\/edit$/.test(path);
  const isPostsActive = path.startsWith('/admin/posts') && !isEditorActive;

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
            end
            className={`admin-nav-link ${isPostsActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">≡</span>文章管理
          </NavLink>
          <NavLink
            to="/admin/posts/new"
            className={`admin-nav-link ${isEditorActive ? 'active' : ''}`}
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
