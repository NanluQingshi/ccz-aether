import React from 'react';
import { Link } from 'react-router-dom';

const TECH_TAGS = [
  { label: 'Java',        color: 'cyan'   },
  { label: 'Spring Boot', color: 'purple' },
  { label: 'React',       color: 'cyan'   },
  { label: 'TypeScript',  color: 'purple' },
  { label: 'MySQL',       color: 'cyan'   },
  { label: 'Docker',      color: 'purple' },
  { label: 'MyBatis',     color: 'cyan'   },
  { label: 'Redis',       color: 'purple' },
  { label: 'Maven',       color: 'cyan'   },
  { label: 'Git',         color: 'purple' },
  { label: 'Linux',       color: 'cyan'   },
  { label: 'REST API',    color: 'purple' },
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

      {/* 右侧：技术标签装饰 */}
      <div className="hero-decoration" aria-hidden="true">
        <div className="hero-glow" />
        <div className="hero-tags">
          {TECH_TAGS.map((tag) => (
            <span key={tag.label} className={`hero-tag hero-tag-${tag.color}`}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
