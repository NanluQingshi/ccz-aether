import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { adminGetStats, adminGetCharts } from '../../api/posts';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalTags: number;
  totalCategories: number;
}

interface ChartData {
  monthlyTrend: { month: string; published: number; views: number }[];
  categoryStats: { name: string; value: number }[];
  tagStats: { name: string; value: number }[];
}

const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#14b8a6', '#ef4444', '#eab308', '#ec4899'];

const StatCard: React.FC<{
  label: string; value: number | string; icon: string;
  accent?: 'cyan' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
}> = ({ label, value, icon, accent = 'cyan' }) => (
  <div className={`stat-card stat-card-${accent}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([adminGetStats(), adminGetCharts()])
      .then(([s, c]) => {
        setStats(s.data);
        setCharts(c.data);
      })
      .catch(() => setError(true));
  }, []);

  if (error) return <div className="admin-page" style={{ color: 'var(--color-neon-pink)' }}>加载失败，请刷新重试</div>;
  if (!stats || !charts) return <LoadingSpinner fullPage />;

  const statusData = [
    { name: '已发布', value: stats.publishedPosts },
    { name: '草稿', value: stats.draftPosts },
  ];

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="stats-grid">
        <StatCard label="总文章数"  value={stats.totalPosts}      icon="📄" accent="cyan"   />
        <StatCard label="已发布"    value={stats.publishedPosts}  icon="✅" accent="green"  />
        <StatCard label="草稿"      value={stats.draftPosts}      icon="✏️" accent="orange" />
        <StatCard label="总阅读量"  value={stats.totalViews}      icon="👁️" accent="purple" />
        <StatCard label="标签数"    value={stats.totalTags}       icon="🏷️" accent="teal"   />
        <StatCard label="分类数"    value={stats.totalCategories} icon="📁" accent="pink"   />
      </div>

      {/* 图表区 */}
      <div className="chart-grid">

        {/* 月度发布趋势 */}
        <div className="chart-card chart-card-wide">
          <h3 className="chart-title">近 12 个月发布趋势</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={charts.monthlyTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#9ca3af' }} allowDecimals={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Legend />
              <Line yAxisId="left"  type="monotone" dataKey="published" name="发布数" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="views"     name="阅读量" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 文章状态饼图 */}
        <div className="chart-card">
          <h3 className="chart-title">文章状态分布</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 分类文章数 */}
        <div className="chart-card">
          <h3 className="chart-title">各分类文章数</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={charts.categoryStats} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#4b5563' }} width={72} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Bar dataKey="value" name="文章数" radius={[0, 4, 4, 0]}>
                {charts.categoryStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 标签使用频率 */}
        <div className="chart-card">
          <h3 className="chart-title">标签使用频率 Top 10</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={charts.tagStats} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#4b5563' }} width={72} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Bar dataKey="value" name="使用次数" fill="#14b8a6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
