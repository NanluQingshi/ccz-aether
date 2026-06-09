import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { adminGetStats, adminGetCharts } from '../../api/posts';
import { FilePlus, FileText, CheckCircle, FileEdit, Eye, Tag, Folder } from 'lucide-react';

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

/* ── Skeleton ── */
const StatSkeleton: React.FC = () => (
  <div className="stat-card stat-skeleton">
    <div className="skeleton-icon" />
    <div className="stat-info">
      <div className="skeleton-value" />
      <div className="skeleton-label" />
    </div>
  </div>
);

const ChartSkeleton: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <div className={`chart-card ${wide ? 'chart-card-wide' : ''} chart-skeleton`}>
    <div className="skeleton-title" />
    <div className="skeleton-chart" />
  </div>
);

/* ── Stat Card ── */
const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent?: 'cyan' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
  sub?: string;
}> = ({ label, value, icon: Icon, accent = 'cyan', sub }) => (
  <div className={`stat-card stat-card-${accent}`}>
    <div className={`stat-icon-wrap stat-icon-${accent}`}>
      <Icon size={20} />
    </div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  </div>
);

/* ── Empty Chart ── */
const EmptyChart: React.FC<{ message?: string }> = ({ message = '暂无数据' }) => (
  <div className="chart-empty">
    <span className="chart-empty-icon">📊</span>
    <span>{message}</span>
  </div>
);

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.allSettled([adminGetStats(), adminGetCharts()])
      .then(([statsResult, chartsResult]) => {
        if (statsResult.status === 'fulfilled') setStats(statsResult.value.data);
        if (chartsResult.status === 'fulfilled') setCharts(chartsResult.value.data);
        if (statsResult.status === 'rejected' && chartsResult.status === 'rejected') setError(true);
      });
  }, []);

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-error-state">
          <span>⚠</span> 加载失败，请刷新重试
        </div>
      </div>
    );
  }

  const loading = !stats || !charts;

  const statusData = stats
    ? [
        { name: '已发布', value: stats.publishedPosts },
        { name: '草稿', value: stats.draftPosts },
      ]
    : [];

  const publishRate = stats && stats.totalPosts > 0
    ? `发布率 ${Math.round((stats.publishedPosts / stats.totalPosts) * 100)}%`
    : undefined;

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">仪表盘</h1>
        <Link to="/admin/posts/new" className="btn btn-primary btn-sm">
          <FilePlus size={14} />
          <span>写新文章</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="总文章数"  value={stats.totalPosts}      icon={FileText}    accent="cyan"   />
            <StatCard label="已发布"    value={stats.publishedPosts}  icon={CheckCircle} accent="green"  sub={publishRate} />
            <StatCard label="草稿"      value={stats.draftPosts}      icon={FileEdit}    accent="orange" />
            <StatCard label="总阅读量"  value={stats.totalViews.toLocaleString()} icon={Eye} accent="purple" />
            <StatCard label="标签数"    value={stats.totalTags}       icon={Tag}         accent="teal"   />
            <StatCard label="分类数"    value={stats.totalCategories} icon={Folder}      accent="pink"   />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="chart-grid">
        {/* Monthly Trend */}
        {loading ? (
          <ChartSkeleton wide />
        ) : (
          <div className="chart-card chart-card-wide">
            <h3 className="chart-title">近 12 个月发布趋势</h3>
            {charts.monthlyTrend.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={charts.monthlyTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis yAxisId="left"  tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line yAxisId="left"  type="monotone" dataKey="published" name="发布数" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} animationDuration={800} />
                  <Line yAxisId="right" type="monotone" dataKey="views"     name="阅读量" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} animationDuration={800} animationBegin={200} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Status Pie */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="chart-card">
            <h3 className="chart-title">文章状态分布</h3>
            {statusData.every((d) => d.value === 0) ? (
              <EmptyChart />
            ) : (
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
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                    animationDuration={800}
                  >
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Category Bar */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="chart-card">
            <h3 className="chart-title">各分类文章数</h3>
            {charts.categoryStats.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={charts.categoryStats} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} width={72} />
                  <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)' }} />
                  <Bar dataKey="value" name="文章数" radius={[0, 4, 4, 0]} animationDuration={800}>
                    {charts.categoryStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Tag Bar */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="chart-card">
            <h3 className="chart-title">标签使用频率 Top 10</h3>
            {charts.tagStats.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={charts.tagStats} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} width={72} />
                  <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)' }} />
                  <Bar dataKey="value" name="使用次数" fill="#14b8a6" radius={[0, 4, 4, 0]} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
