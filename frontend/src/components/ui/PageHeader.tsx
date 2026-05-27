import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  stats?: StatItem[];
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, stats, action }) => (
  <div className="page-header">
    <div className="page-header-top">
      <div className="page-header-text">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
    {stats && stats.length > 0 && (
      <div className="overview-grid">
        {stats.map((s) => (
          <div key={s.label} className="overview-card">
            <div className="overview-card-value">{s.value}</div>
            <div className="overview-card-label">{s.label}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);
