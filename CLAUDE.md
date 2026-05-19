# 项目上下文

个人网站全栈应用，含公开展示站点 + 管理后台。前端 React 18 + TypeScript，后端 Spring Boot 3.3.4，MySQL 8，JWT 单管理员认证，Docker Compose 一键部署。

---

## 技术栈

| 层次 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18.3.1 |
| 前端语言 | TypeScript | 5.6.2 |
| 构建工具 | Vite | 5.4.10 |
| 路由 | React Router | v6 |
| 状态管理 | Zustand | 5.0.13 |
| UI 图标 | lucide-react | 1.16.0 |
| UI 组件 | Radix UI + shadcn/ui | — |
| Markdown 编辑 | @uiw/react-md-editor | 4.1.0 |
| Markdown 渲染 | react-markdown + remark-gfm | — |
| HTTP 客户端 | axios | 1.16.0 |
| 代码高亮 | highlight.js | 11.11.1 |
| 图表 | recharts | 3.8.1 |
| 后端框架 | Spring Boot | 3.3.4 |
| 安全框架 | Spring Security | — |
| ORM | MyBatis-Plus | 3.5.9 |
| 数据库 | MySQL | 8.0 |
| 认证 | JWT (jjwt) | 0.12.6 |
| 对象映射 | MapStruct | 1.6.2 |
| API 文档 | Springdoc OpenAPI | 2.6.0 |
| 部署 | Docker Compose | — |

---

## 目录结构

```
full-stack-project/
├── frontend/                  # React 前端
│   └── src/
│       ├── api/               # Axios 封装的 API 调用模块（9 个）
│       ├── components/        # 可复用组件
│       │   ├── blog/          # MarkdownRenderer、PostCard、TagFilter
│       │   ├── home/          # HeroSection、RecentPosts、SkillsSection
│       │   ├── layout/        # Navbar、Footer、AdminLayout
│       │   └── ui/            # Badge、Button、ConfirmDialog、LoadingSpinner、Pagination、ToastContainer、shadcn/
│       ├── pages/             # 页面组件（10 个公开 + 4 个 admin）
│       ├── router/            # 路由配置 + ProtectedRoute
│       ├── store/             # authStore、uiStore（Zustand）
│       ├── styles/            # components.css、globals.css、markdown.css、theme.css
│       └── types/             # TypeScript 类型定义
├── backend/                   # Spring Boot 后端
│   └── src/main/java/com/personalsite/blog/
│       ├── config/            # Security、MybatisPlus、WebMvc 配置
│       ├── controller/        # REST 控制器（9 个）
│       ├── converter/         # MapStruct 对象转换器
│       ├── dto/               # request/ 和 response/ DTO
│       ├── entity/            # 数据库实体（9 个）
│       ├── exception/         # BizException、ErrorCode、GlobalExceptionHandler
│       ├── mapper/            # MyBatis-Plus Mapper（9 个）
│       ├── security/          # JwtUtil、JwtAuthFilter、AdminUserDetailsService
│       ├── service/           # 服务接口 + impl/ 实现（8 个）
│       └── util/              # SlugUtils
│   └── src/main/resources/
│       ├── application.yml       # 主配置（dev/prod profile 切换）
│       ├── application-dev.yml   # 开发：localhost MySQL，SQL 日志开
│       ├── application-prod.yml  # 生产：环境变量注入
│       ├── mapper/               # MyBatis XML（Category、Post、Tag）
│       └── schema.sql            # 数据库初始化脚本
├── docs/troubleshooting/      # 故障排查文档（5 个模块）
└── docker-compose.yml         # MySQL + Backend 容器编排
```

---

## 页面模块

### 公开页面（10 个）

| 文件 | 路由 | 功能 |
|------|------|------|
| HomePage.tsx | / | Hero + 最新文章 + 技能展示 |
| BlogListPage.tsx | /blog | 博客列表（分页 + 标签过滤） |
| BlogDetailPage.tsx | /blog/:slug | 文章详情 + Markdown 渲染 |
| AiTimelinePage.tsx | /ai-timeline | AI 大事纪时间轴 |
| MusingPage.tsx | /musings | 随想录（idea/todo 两种类型，月份分组） |
| BookshelfPage.tsx | /bookshelf | 书架 |
| IssueBoardPage.tsx | /issues | Issue Bin（看板三列布局） |
| RoadmapPage.tsx | /roadmap | Roadmap 功能规划（进度条 + 分组卡片） |
| AboutPage.tsx | /about | 关于页面 |
| NotFoundPage.tsx | * | 404 页面 |

### 管理后台（4 个，需 JWT 认证）

| 文件 | 路由 | 功能 |
|------|------|------|
| LoginPage.tsx | /admin/login | 管理员登录 |
| DashboardPage.tsx | /admin | 仪表盘（统计图表） |
| PostManagerPage.tsx | /admin/posts | 文章列表管理 |
| PostEditorPage.tsx | /admin/posts/new 或 edit/:id | Markdown 分栏编辑器 |

---

## API 模块（前端 src/api/）

| 文件 | 对应后端 Controller |
|------|---------------------|
| auth.ts | AuthController |
| posts.ts | PostController |
| categories.ts | CategoryController |
| tags.ts | TagController |
| books.ts | BookController |
| issues.ts | IssueController |
| musings.ts | MusingController |
| roadmap.ts | RoadmapController |
| client.ts | Axios 实例 + 拦截器（401 自动登出） |

---

## 数据库实体

| 实体 | 对应功能 |
|------|---------|
| Post | 博客文章（含 slug、Markdown 内容、分类、标签） |
| Category | 文章分类 |
| Tag | 文章标签 |
| PostTag | 文章-标签多对多关联 |
| Book | 书架（书名、作者、状态、评分） |
| Issue | Issue Bin（标题、描述、状态、优先级） |
| Musing | 随想录（content、type=idea/todo、done 状态） |
| RoadmapItem | Roadmap 条目（groupLabel、status、priority） |
| User | 管理员用户（单用户 JWT 认证） |

---

## 后端配置关键点

- **端口**: 9090
- **Profile 切换**: `spring.profiles.active: dev`，生产通过 `SPRING_PROFILES_ACTIVE=prod` 覆盖
- **JWT**: secret 由环境变量 `JWT_SECRET` 注入，过期时间 30 天（`JWT_EXPIRATION_MS=2592000000`）
- **逻辑删除**: `deleted` 字段，1=删除，0=未删除（MyBatis-Plus 全局配置）
- **自动填充**: `createTime` / `updateTime` 由 `MetaObjectHandlerConfig` 自动填充
- **CORS**: 由 `WebMvcConfig` 统一配置

---

## 本地开发启动

```bash
# 数据库
docker compose up mysql -d

# 后端（必须在 backend/ 目录执行，根目录执行会报 spring-boot 插件找不到）
cd backend && mvn spring-boot:run

# 前端
cd frontend && npm install && npm run dev   # 默认 5173 端口
```

---

## 样式架构

- `theme.css` — CSS 变量（颜色、间距、圆角等）
- `globals.css` — 全局基础样式、Reset
- `components.css` — 所有业务组件样式（按模块注释分段）
- `markdown.css` — Markdown 渲染专用样式

主题：深色系，neon 风格配色（cyan、purple）。

---

## 故障排查文档

`docs/troubleshooting/` 目录下：

- `01-环境与构建.md` — 环境配置、Maven 命令、构建问题
- `02-数据库.md` — MySQL 连接、数据迁移
- `03-后端开发.md` — Spring Boot、Security、业务逻辑
- `04-前端开发.md` — React、组件、状态管理
- `05-网络与接口.md` — CORS、HTTP 状态码、接口联调
