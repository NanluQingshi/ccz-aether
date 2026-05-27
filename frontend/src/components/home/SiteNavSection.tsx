import React from 'react';
import { Link } from 'react-router-dom';

const MODULES = [
  { icon: '📝', name: '博客',     desc: '技术文章与系统思考',     to: '/blog'      },
  { icon: '⚔️',  name: '修炼手册', desc: '学习路线与长期积累',     to: '/practice'  },
  { icon: '🗺️', name: 'Roadmap', desc: '功能规划与进展公开',     to: '/roadmap'   },
  { icon: '🗂️', name: 'Issue Bin', desc: '问题、想法与处理中事项', to: '/issues'    },
  { icon: '📚', name: '书页间',   desc: '阅读记录与书评感想',     to: '/bookshelf' },
  { icon: '💭', name: '随想录',   desc: '轻内容与日常记录',       to: '/musings'   },
];

export const SiteNavSection: React.FC = () => (
  <section className="module-nav-section">
    <h2 className="section-title">站点导航</h2>
    <div className="module-nav-grid">
      {MODULES.map((m) => (
        <Link key={m.name} to={m.to} className="module-nav-card">
          <span className="module-nav-icon" aria-hidden="true">{m.icon}</span>
          <div className="module-nav-info">
            <div className="module-nav-name">{m.name}</div>
            <div className="module-nav-desc">{m.desc}</div>
          </div>
          <span className="module-nav-arrow" aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  </section>
);
