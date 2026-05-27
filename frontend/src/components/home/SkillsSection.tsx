import React from 'react';

const capabilities = [
  {
    title: '后端工程',
    keywords: ['高可用', '分布式', 'RESTful'],
    stack: 'Spring Boot / MySQL / Redis / MyBatis',
    practice: '个人网站 API 服务 · 中间件实践',
  },
  {
    title: '前端体验',
    keywords: ['交互', '响应式', '组件化'],
    stack: 'React / TypeScript / Vite / CSS',
    practice: '本站前端全栈改造',
  },
  {
    title: 'AI 辅助开发',
    keywords: ['Prompt 工程', 'Agent', 'RAG'],
    stack: 'Claude API / MCP / Claude Code',
    practice: 'Claude Code 深度使用 · AI 工具集成',
  },
  {
    title: '系统设计',
    keywords: ['架构', '工程化', '分层设计'],
    stack: '分层架构 / Docker / SOLID 原则',
    practice: '个人技术系统站建设',
  },
  {
    title: '内容表达',
    keywords: ['写作', '知识沉淀', '体系化'],
    stack: 'Markdown / 版本管理 / 技术博客',
    practice: '博客 + 随想录持续输出',
  },
];

export const SkillsSection: React.FC = () => (
  <section className="section">
    <h2 className="section-title">能力维度</h2>
    <div className="capability-grid">
      {capabilities.map((c) => (
        <div key={c.title} className="capability-card">
          <div className="capability-title">{c.title}</div>
          <div className="capability-keywords">
            {c.keywords.map((kw) => (
              <span key={kw} className="capability-keyword">{kw}</span>
            ))}
          </div>
          <div className="capability-stack">{c.stack}</div>
          <div className="capability-practice">{c.practice}</div>
        </div>
      ))}
    </div>
  </section>
);
