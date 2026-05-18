import React from 'react';

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <p className="footer-text">
        © {new Date().getFullYear()} 南路情诗.
      </p>
      <span className="footer-motto">切勿眼高手低</span>
      <div className="footer-links">
        <a href="https://github.com/NanluQingshi" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
  </footer>
);
