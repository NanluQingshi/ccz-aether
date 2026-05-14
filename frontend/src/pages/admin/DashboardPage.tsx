import React, { useEffect, useState } from 'react';
import { adminGetStats } from '../../api/posts';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalTags: number;
  totalCategories: number;
}

const StatCard: React.FC<{ label: string; value: number | string; accent?: string }> = ({
  label, value, accent = 'cyan',
}) => (
  <div className={`stat-card stat-card-${accent}`}>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminGetStats()
      .then((r) => setStats(r.data))
      .catch(() => setError(true));
  }, []);

  if (error) return <div className="admin-page" style={{ color: 'var(--color-neon-pink)' }}>加载失败，请刷新重试</div>;
  if (!stats) return <LoadingSpinner fullPage />;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">仪表盘</h1>
      <div className="stats-grid">
        <StatCard label="总文章数" value={stats.totalPosts} accent="cyan" />
        <StatCard label="已发布" value={stats.publishedPosts} accent="green" />
        <StatCard label="草稿" value={stats.draftPosts} accent="purple" />
        <StatCard label="总阅读量" value={stats.totalViews} accent="pink" />
        <StatCard label="标签数" value={stats.totalTags} />
        <StatCard label="分类数" value={stats.totalCategories} />
      </div>
    </div>
  );
};

export default DashboardPage;
