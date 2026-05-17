import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="container page-content" style={{ textAlign: 'center', paddingTop: '6rem' }}>
    <h1 style={{ fontSize: 'clamp(3rem, 15vw, 6rem)', color: 'var(--color-neon-cyan)', fontFamily: 'var(--font-mono)' }}>
      404
    </h1>
    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
      页面不存在
    </p>
    <Link to="/" className="btn btn-primary">回到首页</Link>
  </div>
);

export default NotFoundPage;
