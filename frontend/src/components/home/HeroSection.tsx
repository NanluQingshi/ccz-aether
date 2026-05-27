import React from 'react';
import { Link } from 'react-router-dom';

const FOCUS_TAGS = ['Spring Boot', 'React', 'Claude API', '系统设计'];

const MODULE_SHORTCUTS = [
  { label: '博客',      to: '/blog'      },
  { label: 'Roadmap',  to: '/roadmap'   },
  { label: '修炼手册',  to: '/practice'  },
  { label: 'Issue Bin', to: '/issues'    },
];

export const HeroSection: React.FC = () => (
  <section className="hero">
    <div className="hero-inner">
      {/* 左侧：文字内容 */}
      <div className="hero-content">
        <p className="hero-greeting">你好，我是</p>
        <h1 className="hero-name">
          <span className="hero-name-highlight">南路情诗</span>
        </h1>
        <p className="hero-desc">
          专注于全栈开发，热衷于探索新技术，喜欢写代码、写文章。
        </p>
        <p className="hero-motto">沉心蓄力，静待风起</p>
        <div className="hero-actions">
          <Link to="/blog" className="btn btn-primary btn-lg">阅读博客</Link>
          <Link to="/about" className="btn btn-ghost btn-lg">关于我</Link>
        </div>
      </div>

      {/* 右侧：结构化信息面板 */}
      <div className="hero-decoration">
        <div className="hero-glow" />
        <div className="hero-info-panel">
          <div className="hero-info-card">
            <span className="hero-info-label">当前身份</span>
            <p className="hero-info-value">全栈工程师 · AI 应用开发</p>
          </div>
          <div className="hero-info-card">
            <span className="hero-info-label">当前关注</span>
            <div className="hero-focus-tags">
              {FOCUS_TAGS.map((tag) => (
                <span key={tag} className="hero-focus-tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="hero-info-card">
            <span className="hero-info-label">站点模块</span>
            <div className="hero-modules">
              {MODULE_SHORTCUTS.map((m) => (
                <Link key={m.label} to={m.to} className="hero-module-btn">
                  {m.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
