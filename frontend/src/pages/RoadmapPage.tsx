import React from 'react';

type Priority = 'high' | 'medium' | 'low';
type Status = 'done' | 'planned';

interface Feature {
  name: string;
  desc: string;
  status: Status;
  priority?: Priority;
}

interface FeatureGroup {
  label: string;
  icon: string;
  features: Feature[];
}

const groups: FeatureGroup[] = [
  {
    label: '内容',
    icon: '◈',
    features: [
      { name: '技术博客', desc: 'Markdown 写作，代码高亮，标签 / 分类筛选', status: 'done' },
      { name: 'AI 大事纪', desc: '竖向时间轴，按年份分组，记录 AI 发展里程碑', status: 'done' },
      { name: '评论系统', desc: '访客可在博客文章下留言互动', status: 'planned', priority: 'medium' },
      { name: 'RSS Feed', desc: '输出标准 RSS，方便订阅工具抓取', status: 'planned', priority: 'low' },
      { name: '知识库', desc: '整理、沉淀个人技术笔记与学习资料，支持分类检索', status: 'planned', priority: 'low' },
      { name: 'Issue Bin', desc: '记录暂时无法解决的技术问题，方便后续追踪与复盘', status: 'done' },
      { name: '修炼手册', desc: '制定个人学习计划，追踪各方向的学习进度与阶段目标', status: 'planned', priority: 'low' },
      { name: '书页间', desc: '记录已读与在读书目，附上个人评分与读后感', status: 'planned', priority: 'low' },
      { name: '个人 Todo', desc: '日常事项与目标追踪，和网站功能无关的个人待办', status: 'planned', priority: 'low' },
      { name: '随想录', desc: '随手记录灵感、念头与阶段计划，不设格式，想到就写', status: 'done' },
    ],
  },
  {
    label: '功能',
    icon: '⚙',
    features: [
      { name: 'Markdown 编辑器', desc: '分栏实时预览，后台写作体验', status: 'done' },
      { name: '标签 / 分类管理', desc: '多维度组织文章内容', status: 'done' },
      { name: '全文搜索', desc: '快速检索站内所有文章', status: 'planned', priority: 'high' },
      { name: '图片上传', desc: '支持本地存储或 S3，告别外链依赖', status: 'planned', priority: 'medium' },
    ],
  },
  {
    label: '管理后台',
    icon: '⊞',
    features: [
      { name: 'JWT 认证', desc: '单管理员登录，Token 鉴权', status: 'done' },
      { name: '文章管理', desc: '创建、编辑、删除、发布一站式管理', status: 'done' },
      { name: '仪表盘统计', desc: '文章数、阅读量等核心数据一览', status: 'done' },
      { name: '访问统计看板', desc: '更详细的 PV / UV 与热门文章分析', status: 'planned', priority: 'low' },
    ],
  },
  {
    label: '体验',
    icon: '✦',
    features: [
      { name: '暗色科技感主题', desc: '全站统一的深色 UI，霓虹青 / 紫双主色', status: 'done' },
      { name: '响应式布局', desc: '适配移动端、平板、桌面多种屏幕', status: 'done' },
      { name: '明暗主题切换', desc: '用户可自由切换 Dark / Light 模式', status: 'planned', priority: 'medium' },
    ],
  },
  {
    label: '部署',
    icon: '⬡',
    features: [
      { name: 'Docker Compose', desc: '一键启动 MySQL + 后端容器', status: 'done' },
      { name: '云数据库支持', desc: '通过环境变量无缝切换本地 / 云端 MySQL', status: 'done' },
    ],
  },
];

const priorityMap: Record<Priority, { label: string; className: string }> = {
  high:   { label: '高', className: 'priority-high' },
  medium: { label: '中', className: 'priority-medium' },
  low:    { label: '低', className: 'priority-low' },
};

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const sortFeatures = (features: Feature[]): Feature[] => [
  ...features.filter((f) => f.status === 'done'),
  ...features
    .filter((f) => f.status === 'planned')
    .sort((a, b) => priorityOrder[a.priority ?? 'low'] - priorityOrder[b.priority ?? 'low']),
];

const RoadmapPage: React.FC = () => {
  const allFeatures = groups.flatMap((g) => g.features);
  const doneCount = allFeatures.filter((f) => f.status === 'done').length;
  const totalCount = allFeatures.length;
  const percent = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="container page-content">
      {/* Header */}
      <div className="roadmap-header">
        <h1 className="page-title">Roadmap</h1>
        <p className="roadmap-subtitle">功能规划与进展追踪</p>
      </div>

      {/* Progress bar */}
      <div className="roadmap-progress-wrap">
        <div className="roadmap-progress-header">
          <span className="roadmap-progress-label">
            总进度 &nbsp;
            <span className="roadmap-progress-fraction">{doneCount} / {totalCount}</span>
          </span>
          <span className="roadmap-progress-percent">{percent}%</span>
        </div>
        <div className="roadmap-progress-bar">
          <div
            className="roadmap-progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Priority note */}
      <p className="roadmap-priority-note">
        优先级基于当前的开发想法与技术储备评估，仅供参考，会随实际情况动态调整。
      </p>

      {/* Groups */}
      {groups.map((group) => (
        <div key={group.label} className="roadmap-group">
          <h2 className="roadmap-group-title">
            <span className="roadmap-group-icon">{group.icon}</span>
            {group.label}
          </h2>
          <div className="roadmap-grid">
            {sortFeatures(group.features).map((feature) => (
              <div
                key={feature.name}
                className={`roadmap-card ${feature.status === 'done' ? 'roadmap-card-done' : 'roadmap-card-planned'}`}
              >
                <div className="roadmap-card-top">
                  <span className={`roadmap-status-icon ${feature.status === 'done' ? 'icon-done' : 'icon-planned'}`}>
                    {feature.status === 'done' ? '✓' : '○'}
                  </span>
                  {feature.priority && (
                    <span className={`roadmap-priority ${priorityMap[feature.priority].className}`}>
                      {priorityMap[feature.priority].label}
                    </span>
                  )}
                </div>
                <h3 className="roadmap-card-name">{feature.name}</h3>
                <p className="roadmap-card-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapPage;
