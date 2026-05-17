import React from 'react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => (
  <section className="hero">
    <div className="hero-content">
      <p className="hero-greeting">你好，我是</p>
      <h1 className="hero-name">
        <span className="hero-name-highlight">Developer</span>
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
    <div className="hero-decoration" aria-hidden="true">
      <div className="hero-glow" />
    </div>
  </section>
);
