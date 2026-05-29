<div align="center">

```
 ██████╗ ███████╗██████╗ ███████╗ ██████╗ ███╗   ██╗ █████╗ ██╗
 ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║██╔══██╗██║
 ██████╔╝█████╗  ██████╔╝███████╗██║   ██║██╔██╗ ██║███████║██║
 ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║██║   ██║██║╚██╗██║██╔══██║██║
 ██║     ███████╗██║  ██║███████║╚██████╔╝██║ ╚████║██║  ██║███████╗
 ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
```

**不只是博客 — 这是一个赛博朋克风格的个人知识操作系统**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/17/)

*[中文](#-中文) · [English](#-english)*

</div>

---

## ✨ 这是什么？

这是一个**持续进化的个人数字基地**，深色 neon 配色，赛博朋克美学。不是那种部署完就落灰的博客模板——每一个模块都在问你：*"你今天又积累了什么？"*

> 博客 × AI时间轴 × 随想录 × 书架 × Issue看板 × 技能修炼手册 × 公开Roadmap × 收藏导航

前后端完全分离，Docker 一键部署，JWT 守护后台，Markdown 写作一气呵成。

---

## 🌐 中文

### 功能地图

```
┌─────────────────────────────────────────────────────────────────────┐
│                           公开展示面                                  │
├──────────┬──────────┬──────────┬──────────┬──────────┬─────────────┤
│  🏠 主页  │  📝 博客  │  🤖 AI  │  💭 随想 │  📚 书架 │  ⚔️ 修炼    │
│  Hero区  │ 标签/分类 │  时间轴  │  月份归档 │ 进度追踪 │ 技能清单    │
│  技能展示 │ 分页浏览  │  年份分组 │ Todo管理 │ 评分书评 │  外链资源   │
├──────────┴──────────┴──────────┴──────────┴──────────┴─────────────┤
│                                                                     │
│     🗂️ Issue看板  ·  🗺️ Roadmap  ·  🔗 收藏导航  ·  👤 关于我        │
│   Todo/进行中/完成   进度条+分组   分类网址收藏     个人介绍            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                      🔐 管理后台（JWT保护）                            │
├──────────┬──────────┬────────────────────────────────────────────── ┤
│  登录     │  仪表盘   │  文章/随想/书架/Issue/Roadmap/修炼/导航 全CRUD  │
│  30天免登 │  图表统计 │  分栏Markdown编辑器 · 实时预览                  │
└──────────┴──────────┴─────────────────────────────────────────────-─┘
```

### 技术栈

```
╔══════════════════════════════════════════════════════╗
║  FRONTEND                                            ║
║  React 18 · TypeScript · Vite · React Router v6      ║
║  Zustand · Axios · Recharts · Radix UI               ║
║  react-markdown · @uiw/react-md-editor · highlight.js ║
║  纯 CSS 自定义属性（不跟 Tailwind 的风）                ║
╠══════════════════════════════════════════════════════╣
║  BACKEND                                             ║
║  Spring Boot 3.3.4 · Java 17 · Spring Security       ║
║  MyBatis-Plus 3.5.9 · MySQL 8 · JWT(JJWT 0.12.6)    ║
║  MapStruct · Lombok · SpringDoc OpenAPI              ║
╠══════════════════════════════════════════════════════╣
║  DEPLOYMENT                                          ║
║  Docker Compose · Nginx · dev/prod profile · 健康检查  ║
╚══════════════════════════════════════════════════════╝
```

### 项目结构

```
full-stack-project/
├── frontend/                  # React 前端（Vite 构建）
│   ├── .env                   # 本地开发环境变量
│   ├── .env.production        # 生产构建环境变量
│   ├── .npmrc                 # npm 注册源配置
│   └── src/
│       ├── api/               # 11 个 Axios API 模块 + 拦截器
│       ├── components/        # 可复用组件（blog/home/layout/ui）
│       ├── pages/             # 12 公开页面 + 4 Admin 页面
│       ├── router/            # 路由配置 + ProtectedRoute
│       ├── store/             # Zustand（auth + ui/toast）
│       ├── styles/            # theme / globals / components / markdown
│       └── types/             # TypeScript 类型定义
├── backend/                   # Spring Boot 后端（端口 9090）
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/personalsite/blog/
│       │   ├── controller/    # 11 个 REST 控制器
│       │   ├── service/       # 10 个业务服务
│       │   ├── entity/        # 11 个实体（含逻辑删除）
│       │   ├── enums/         # 业务枚举（@EnumValue）
│       │   ├── security/      # JWT 工具 + 过滤器
│       │   ├── converter/     # MapStruct 对象转换
│       │   └── config/        # Security / WebMvc / MyBatis-Plus
│       └── resources/
│           ├── application.yml        # 主配置（dev/prod 切换）
│           ├── application-dev.yml    # 本地开发（SQL日志开）
│           ├── application-prod.yml   # 生产（环境变量注入）
│           └── schema.sql             # 数据库初始化 + 种子数据
├── deploy/                    # 部署相关配置
│   ├── nginx.conf             # Nginx 反向代理配置模板
│   └── .env.example           # 服务器环境变量模板
├── docs/
│   ├── deployment.md          # 云服务器完整部署指南
│   └── troubleshooting/       # 按模块归档的故障排查文档（5个）
└── docker-compose.yml         # MySQL + Backend 一键编排
```

### 🚀 本地开发

#### 前置要求

```
Node.js 18+  ·  pnpm  ·  JDK 17+  ·  Maven 3.8+  ·  Docker
```

#### 三步起飞

```bash
# Step 1 — 启动数据库（会自动建表+写入种子数据）
docker compose up mysql -d

# Step 2 — 启动后端（⚠️ 必须在 backend/ 目录执行）
cd backend && mvn spring-boot:run
# → http://localhost:9090
# → http://localhost:9090/swagger-ui.html  （Swagger UI）

# Step 3 — 启动前端
cd frontend && pnpm install && pnpm dev
# → http://localhost:5173
```

#### 配置数据库连接

编辑 `backend/src/main/resources/application-dev.yml`：

```yaml
spring:
  datasource:
    username: root           # 你的 MySQL 用户名
    password: your_password  # 你的 MySQL 密码
```

#### 默认管理员账号

| 字段 | 值 |
|------|---|
| 登录地址 | `http://localhost:5173/admin/login` |
| 用户名 | `admin` |
| 密码 | `Admin@123456` |

> ⚠️ **生产环境部署后请立即修改密码！**

### 🗺️ 页面路由速查

| 路径 | 模块 | 是否需要登录 |
|------|------|:-----------:|
| `/` | 主页 | — |
| `/blog` | 博客列表（标签/分类过滤） | — |
| `/blog/:slug` | 博客详情（Markdown渲染） | — |
| `/ai-timeline` | AI 大事纪时间轴 | — |
| `/musings` | 随想录（idea & todo） | — |
| `/bookshelf` | 书架（三状态+评分） | — |
| `/issues` | Issue 看板（三列） | — |
| `/roadmap` | 功能 Roadmap | — |
| `/practice` | 修炼手册 | — |
| `/sites` | 收藏导航（分类网址收藏） | — |
| `/about` | 关于 | — |
| `/admin/login` | 管理员登录 | — |
| `/admin` | 仪表盘（图表统计） | ✅ |
| `/admin/posts` | 文章管理 | ✅ |
| `/admin/posts/new` | 新建文章（Markdown 编辑器） | ✅ |
| `/admin/posts/edit/:id` | 编辑文章 | ✅ |

### 📡 API 速查

**公开接口**（无需认证）

```
GET  /api/posts                 文章列表（分页 + 标签/分类过滤）
GET  /api/posts/:slug           文章详情（自动记录浏览量）
GET  /api/posts/ai-timeline     AI 时间轴文章列表
GET  /api/tags                  标签列表
GET  /api/categories            分类列表
GET  /api/musings               随想录
GET  /api/books                 书架
GET  /api/issues                Issue 列表
GET  /api/roadmap               Roadmap 条目
GET  /api/practice              修炼手册
GET  /api/sites                 收藏导航
POST /api/auth/login            登录（返回 JWT）
```

**管理接口**（需 `Authorization: Bearer <token>`）

```
# 文章
GET/POST       /api/admin/posts
PUT/DELETE     /api/admin/posts/:id
PATCH          /api/admin/posts/:id/publish
GET            /api/admin/stats              # 仪表盘数据

# 标签 & 分类
POST/DELETE    /api/admin/tags/:id
POST/DELETE    /api/admin/categories/:id

# 随想录、书架、Issue、Roadmap、修炼手册、收藏导航
# 均支持完整 CRUD，路径形如 /api/{resource}/:id
```

### 📦 生产部署

详细步骤见 [docs/deployment.md](docs/deployment.md)，包含环境安装、数据迁移、Nginx 配置、HTTPS 申请等完整流程。

快速概览：

```bash
# 1. 修改 frontend/.env.production 和 deploy/nginx.conf 中的域名
# 2. 本地构建前端
cd frontend && pnpm build

# 3. 服务器上配置环境变量（参考 deploy/.env.example）
cp deploy/.env.example .env && nano .env

# 4. 启动后端 + 数据库
docker compose up -d --build

# 5. 导入本地数据（可选）
docker exec -i blog_mysql mysql -u blog_user -p<password> blog_db < backup.sql
```

**关键环境变量**

| 变量 | 说明 |
|------|------|
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 |
| `MYSQL_PASSWORD` | `blog_user` 密码 |
| `JWT_SECRET` | JWT 签名密钥（至少 32 字符，用 `openssl rand -hex 32` 生成） |
| `CORS_ALLOWED_ORIGINS` | 允许跨域的前端域名 |

### 🔧 故障排查

遇到问题先查 `docs/troubleshooting/`，按模块归档：

| 文件 | 覆盖场景 |
|------|---------|
| `01-环境与构建.md` | Maven 命令、JDK 版本、构建报错 |
| `02-数据库.md` | MySQL 连接失败、数据迁移 |
| `03-后端开发.md` | Spring Security、JWT、业务逻辑 |
| `04-前端开发.md` | React 组件、Zustand 状态 |
| `05-网络与接口.md` | CORS、HTTP 状态码、接口联调 |

---

## 🌍 English

### What Is This?

A **personal knowledge operating system** dressed in cyberpunk aesthetics — dark neon theme, cyan & purple palette. Not a dead-on-deploy blog template. Every module is designed to keep growing with you.

> Blog × AI Timeline × Musings × Bookshelf × Issue Board × Skill Tracker × Public Roadmap × Site Collection

Full decoupled architecture, one-command Docker deployment, JWT-protected admin, pure Markdown writing flow.

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18 · TypeScript · Vite · Zustand · React Router v6 |
| Styling | Pure CSS custom properties — dark tech theme, zero UI framework |
| Markdown | react-markdown · rehype-highlight · @uiw/react-md-editor |
| Charts | Recharts |
| Backend | Java 17 · Spring Boot 3.3.4 · Spring Security · MyBatis-Plus 3.5.9 |
| Database | MySQL 8 |
| Auth | JWT / JJWT 0.12.6 (single-admin, 30-day tokens) |
| Mapping | MapStruct |
| Deployment | Docker Compose · Nginx |

### Features

**Public Pages**

| Module | Route | What it does |
|--------|-------|-------------|
| 🏠 Home | `/` | Hero section · skills showcase · recent posts |
| 📝 Blog | `/blog` | Paginated posts · tag & category filters |
| 🤖 AI Timeline | `/ai-timeline` | Vertical timeline of AI milestones, grouped by year |
| 💭 Musings | `/musings` | Ideas & todos, grouped by month · filterable |
| 📚 Bookshelf | `/bookshelf` | Reading/Want/Done tabs · ratings · progress bars |
| 🗂️ Issue Bin | `/issues` | Kanban board · priority sorting · independent scroll |
| 🗺️ Roadmap | `/roadmap` | Public feature roadmap · overall progress bar |
| ⚔️ Practice | `/practice` | Skill tracker · categories · status · linked resources |
| 🔗 Sites | `/sites` | Curated site collection grouped by category · favicons |
| 👤 About | `/about` | About me |

**Admin Panel** (JWT protected)

- Full CRUD for posts, musings, books, issues, roadmap items, practice entries, and sites
- Split-pane Markdown editor with live preview
- Dashboard with post stats & view count trends (Recharts)
- Tag & category management
- Auto logout on token expiry with toast notification

### Local Development

#### Prerequisites

```
Node.js 18+  ·  pnpm  ·  JDK 17+  ·  Maven 3.8+  ·  Docker
```

#### Quickstart

```bash
# Step 1 — Start the database
docker compose up mysql -d

# Step 2 — Start the backend (⚠️ must run from backend/ directory)
cd backend && mvn spring-boot:run
# → http://localhost:9090
# → http://localhost:9090/swagger-ui.html

# Step 3 — Start the frontend
cd frontend && pnpm install && pnpm dev
# → http://localhost:5173
```

Edit `backend/src/main/resources/application-dev.yml` to set your MySQL credentials.

#### Default Admin Credentials

| Field | Value |
|-------|-------|
| Login URL | `http://localhost:5173/admin/login` |
| Username | `admin` |
| Password | `Admin@123456` |

> ⚠️ **Change the password immediately after first deployment!**

### Production Deployment

See [docs/deployment.md](docs/deployment.md) for the full step-by-step guide (server setup, data migration, Nginx config, HTTPS).

```bash
# On your local machine
cd frontend && pnpm build          # outputs to dist/

# On the server
cp deploy/.env.example .env        # fill in real values
docker compose up -d --build
```

---

<div align="center">

**数据库实体关系速览**

```
User ──── 单管理员 JWT 认证
Post ──── 博客文章 (slug · Markdown · 分类 · 标签 · 阅读量 · 软删除)
  └── type=ai_timeline → AI时间轴（带 event_date）
Tag ──── 多对多 ──── PostTag
Category ──── Post
Issue ──── 看板任务 (priority × status)
Musing ──── 随想 / Todo（月份时间轴）
Book ──── 书架（状态 · 评分 · 进度 · 书评）
RoadmapItem ──── 分组 · 排序 · 状态 · 优先级
Practice ──── 技能条目（分类 · 状态 · links JSON）
Site ──── 收藏导航（名称 · URL · 分类 · 排序）
```

---

*「写代码是写给人看的，顺便让机器执行。」*

Made with ☕ + 🎧 + way too many late nights.

</div>
