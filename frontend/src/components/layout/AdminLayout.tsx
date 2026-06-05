import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import {
  LayoutDashboard, FileText, FilePlus, ChevronLeft, ChevronRight,
  LogOut, User,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useUiStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('已退出登录', 'info');
    navigate('/admin/login');
  };

  const path = location.pathname;
  const isEditorActive = path === '/admin/posts/new' || /^\/admin\/posts\/\d+\/edit$/.test(path);
  const isPostsActive = path.startsWith('/admin/posts') && !isEditorActive;

  const navItems = [
    {
      group: '概览',
      items: [
        { to: '/admin/dashboard', label: '仪表盘', icon: LayoutDashboard, active: undefined as boolean | undefined },
      ],
    },
    {
      group: '内容管理',
      items: [
        { to: '/admin/posts', label: '文章管理', icon: FileText, active: isPostsActive },
        { to: '/admin/posts/new', label: '写新文章', icon: FilePlus, active: isEditorActive },
      ],
    },
  ];

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div className="sidebar-logo-icon">
            <LayoutDashboard size={22} />
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? '展开侧边栏' : '折叠侧边栏'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {navItems.map((group) => (
            <div key={group.group} className="admin-nav-group">
              {!collapsed && <span className="admin-nav-group-label">{group.group}</span>}
              {group.items.map(({ to, label, icon: Icon, active }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `admin-nav-link ${(active !== undefined ? active : isActive) ? 'active' : ''}`
                  }
                  title={collapsed ? label : undefined}
                >
                  <span className="admin-nav-icon-wrap">
                    <Icon size={18} />
                  </span>
                  {!collapsed && <span className="admin-nav-label">{label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <User size={14} />
            </div>
            {!collapsed && (
              <div className="admin-user-meta">
                <span className="admin-username">{username}</span>
                <span className="admin-user-role">管理员</span>
              </div>
            )}
          </div>
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
            title="退出登录"
          >
            <LogOut size={14} />
            {!collapsed && <span>退出</span>}
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};
