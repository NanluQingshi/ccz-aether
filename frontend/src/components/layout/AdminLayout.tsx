import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import {
  LayoutDashboard, FileText, FilePlus, ChevronLeft, ChevronRight,
  LogOut, User, Zap, Tag, Folder, BookOpen, AlertCircle,
  MessageSquare, Dumbbell, Map, Globe,
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
      group: '文章',
      items: [
        { to: '/admin/posts',      label: '文章管理', icon: FileText,  active: isPostsActive },
        { to: '/admin/posts/new',  label: '写新文章', icon: FilePlus,  active: isEditorActive },
        { to: '/admin/tags',       label: '标签管理', icon: Tag,       active: undefined },
        { to: '/admin/categories', label: '分类管理', icon: Folder,    active: undefined },
      ],
    },
    {
      group: '内容模块',
      items: [
        { to: '/admin/books',    label: '书籍',     icon: BookOpen,      active: undefined },
        { to: '/admin/issues',   label: 'Issue',    icon: AlertCircle,   active: undefined },
        { to: '/admin/musings',  label: '随想录',   icon: MessageSquare, active: undefined },
        { to: '/admin/practice', label: '修炼手册', icon: Dumbbell,      active: undefined },
        { to: '/admin/roadmap',  label: 'Roadmap',  icon: Map,           active: undefined },
        { to: '/admin/sites',    label: '网站导航', icon: Globe,         active: undefined },
      ],
    },
  ];

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar-logo">
          {collapsed ? (
            <button
              className="sidebar-collapse-btn sidebar-expand-only"
              onClick={() => setCollapsed(false)}
              title="展开侧边栏"
            >
              <ChevronRight size={16} />
            </button>
          ) : (
            <>
              <div className="sidebar-logo-icon">
                <Zap size={20} />
              </div>
              <button
                className="sidebar-collapse-btn"
                onClick={() => setCollapsed(true)}
                title="折叠侧边栏"
              >
                <ChevronLeft size={14} />
              </button>
            </>
          )}
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
