# Personal Site

> 个人网站 · 技术博客 · 随想录 · 书架 · Issue Bin · Roadmap  
> A personal website with a tech blog, AI timeline, bookshelf, musings, and more — built with a modern full-stack architecture.

[中文](#中文) · [English](#english)

---

## 中文

### 项目简介

一个持续成长的个人网站，前后端分离，部署灵活。目前包含技术博客、AI 大事纪、随想录、书页间、Issue Bin、Roadmap 等板块，后续会持续扩展。支持 Markdown 写作、标签与分类管理，以及统一的后台管理系统。

### 技术栈

| 层级 | 技术选型 |
|------|---------|
| 前端 | React 18 · TypeScript · Vite · Zustand · React Router v6 |
| 样式 | 纯 CSS 自定义属性（暗色科技感主题，无 UI 框架依赖） |
| Markdown | react-markdown · rehype-highlight · @uiw/react-md-editor |
| 后端 | Java 17 · Spring Boot 3 · Spring Security · MyBatis-Plus |
| 数据库 | MySQL 8（支持全文检索） |
| 认证 | JWT（单管理员模式，30 天有效期） |
| 部署 | Docker Compose |

### 功能特性

**公开页面**
- 首页：个人介绍、技能展示、最新文章；Hero 区双栏布局，右侧技术标签浮动装饰
- 博客列表：分页浏览，按标签 / 分类筛选
- 博客详情：Markdown 渲染，代码语法高亮，标题锚点
- AI 大事纪：竖向时间轴，按年份分组，记录 AI 发展里程碑
- 随想录：时间轴展示，支持随想 / Todo 两种类型，可按类型筛选，Todo 已完成自动置底
- 书页间：书架展示，按在读 / 想读 / 已读分类，支持评分、读后感、阅读进度
- Issue Bin：看板式三列布局（Todo / In Progress / Done），按优先级与创建时间排序，列内容超出可滚动
- Roadmap：功能规划与进展追踪，进度条展示整体完成率
- 关于页

**后台管理**（需登录）
- 文章管理：创建 / 编辑 / 删除 / 发布，支持普通博客与 AI 大事纪两种类型
- Markdown 分栏编辑器，实时预览
- 标签与分类管理
- 仪表盘统计（文章数、阅读量等）
- 随想录管理：新增 / 编辑 / 删除 / 标记完成
- 书页间管理：新增 / 编辑 / 删除，更新阅读进度
- Issue Bin 管理：新建 / 编辑 / 删除 / 状态流转
- Roadmap 管理：新增 / 编辑 / 删除条目，动态维护规划内容
- Token 过期自动登出并提示，无需手动清除本地存储

### 项目结构

```
full-stack-project/
├── frontend/                  # React 前端
│   └── src/
│       ├── api/               # Axios 封装（含响应拦截、错误提取）
│       ├── components/        # 通用组件 & 布局
│       ├── pages/             # 页面（含 admin/）
│       ├── router/            # 路由 & 权限守卫
│       ├── store/             # Zustand 全局状态（auth / ui）
│       ├── types/             # TypeScript 类型
│       └── styles/            # 主题 CSS 变量
├── backend/                   # Spring Boot 后端
│   └── src/main/java/com/personalsite/blog/
│       ├── controller/        # REST 接口
│       ├── service/           # 业务逻辑
│       ├── mapper/            # MyBatis-Plus Mapper
│       ├── entity/            # 数据库实体
│       ├── dto/               # 请求 / 响应 DTO
│       ├── security/          # JWT 认证过滤器
│       └── config/            # Spring 配置
├── docs/
│   └── troubleshooting/       # 问题排查文档
├── docker-compose.yml
└── README.md
```

### 本地开发

#### 前置要求

- Node.js 18+ · pnpm
- JDK 17+
- Maven 3.8+
- MySQL 8

#### 1. 初始化数据库

```bash
mysql -u root -p < backend/src/main/resources/schema.sql
```

脚本会自动创建 `blog_db` 数据库、建表，并写入默认管理员账号和示例数据。

#### 2. 配置数据库连接

编辑 `backend/src/main/resources/application-dev.yml`：

```yaml
spring:
  datasource:
    username: root           # 你的 MySQL 用户名
    password: your_password  # 你的 MySQL 密码
```

#### 3. 启动后端

```bash
cd backend
mvn spring-boot:run
```

- 后端地址：`http://localhost:9090`
- Swagger UI：`http://localhost:9090/swagger-ui.html`

#### 4. 启动前端

```bash
cd frontend
pnpm install
pnpm dev
```

- 前端地址：`http://localhost:5173`

### 默认管理员账号

| | |
|--|--|
| 登录入口 | `http://localhost:5173/admin/login` |
| 用户名 | `admin` |
| 密码 | `Admin@123456` |

> ⚠️ 首次部署后请立即修改密码。

### 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/blog` | 博客列表 |
| `/blog/:slug` | 博客详情 |
| `/ai` | AI 大事纪时间轴 |
| `/musings` | 随想录 |
| `/bookshelf` | 书页间 |
| `/issues` | Issue Bin |
| `/roadmap` | Roadmap |
| `/about` | 关于 |
| `/admin/login` | 管理员登录 |
| `/admin/dashboard` | 仪表盘 |
| `/admin/posts` | 文章管理 |
| `/admin/posts/new` | 写新文章 |

### API 概览

**公开接口**

```
GET  /api/posts                 文章列表（分页 + 过滤）
GET  /api/posts/:slug           文章详情
GET  /api/posts/ai-timeline     AI 大事纪列表
GET  /api/tags                  标签列表
GET  /api/categories            分类列表
GET  /api/musings               随想录列表
GET  /api/books                 书架列表
GET  /api/issues                Issue 列表
GET  /api/roadmap               Roadmap 条目列表
POST /api/auth/login            管理员登录
```

**管理接口**（需 `Authorization: Bearer <token>`）

```
GET    /api/admin/posts              所有文章（含草稿）
POST   /api/admin/posts              创建文章
PUT    /api/admin/posts/:id          更新文章
DELETE /api/admin/posts/:id          删除文章
PATCH  /api/admin/posts/:id/publish  切换发布状态
POST   /api/admin/tags               创建标签
DELETE /api/admin/tags/:id           删除标签
POST   /api/admin/categories         创建分类
DELETE /api/admin/categories/:id     删除分类
GET    /api/admin/stats              仪表盘统计

POST   /api/musings                  新建随想
PUT    /api/musings/:id              编辑随想
PATCH  /api/musings/:id/toggle       切换 Todo 完成状态
DELETE /api/musings/:id              删除随想

POST   /api/books                    新增书目
PUT    /api/books/:id                更新书目
DELETE /api/books/:id                删除书目

POST   /api/issues                   新建 Issue
PUT    /api/issues/:id               更新 Issue
PATCH  /api/issues/:id/status        更新 Issue 状态
DELETE /api/issues/:id               删除 Issue

POST   /api/roadmap                  新增 Roadmap 条目
PUT    /api/roadmap/:id              更新 Roadmap 条目
DELETE /api/roadmap/:id              删除 Roadmap 条目
```

### 生产部署

**Docker Compose（推荐）**

```bash
# 配置环境变量
cp .env.example .env
# 编辑 .env，填入数据库密码和 JWT 密钥

docker compose up -d
```

**手动部署**

```bash
# 后端打包
cd backend
mvn package -DskipTests
java -jar target/blog-*.jar --spring.profiles.active=prod

# 前端打包
cd frontend
pnpm build
# 将 dist/ 部署到 Nginx 或任意静态托管服务
```

**后端生产环境变量**

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://your-host:3306/blog_db?useSSL=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4
SPRING_DATASOURCE_USERNAME=your_user
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your-random-secret-at-least-32-chars
JWT_EXPIRATION_MS=2592000000   # 30天，可按需调整
```

**迁移到云数据库**

```bash
# 1. 导出本地数据
mysqldump -u root -p blog_db > backup.sql
# 2. 导入到云端
mysql -h cloud-host -u user -p blog_db < backup.sql
# 3. 更新 SPRING_DATASOURCE_URL 指向云端地址
```

---

## English

### Overview

A growing personal website with a tech blog, AI milestone timeline, bookshelf, musings, issue tracker, and roadmap — built with a decoupled frontend/backend architecture and flexible deployment.

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18 · TypeScript · Vite · Zustand · React Router v6 |
| Styling | Pure CSS custom properties (dark tech theme, no UI framework) |
| Markdown | react-markdown · rehype-highlight · @uiw/react-md-editor |
| Backend | Java 17 · Spring Boot 3 · Spring Security · MyBatis-Plus |
| Database | MySQL 8 (with full-text search support) |
| Auth | JWT (single-admin model, 30-day expiry) |
| Deployment | Docker Compose |

### Features

**Public Pages**
- Home: personal intro, skills, recent posts; two-column Hero layout with floating tech-tag decoration
- Blog list: paginated, filterable by tag / category
- Blog detail: Markdown rendering, syntax highlighting, heading anchors
- AI Timeline: vertical timeline grouped by year, tracking AI milestones
- Musings: timeline view with idea / todo types, filterable by type, completed todos sink to the bottom
- Bookshelf: categorized by reading status, with rating, review, and progress tracking
- Issue Bin: kanban board (Todo / In Progress / Done), sorted by priority and creation time, columns scroll independently
- Roadmap: feature planning with overall progress bar, dynamically managed from the admin panel
- About page

**Admin Panel** (login required)
- Post management: create / edit / delete / publish (blog posts & AI timeline entries)
- Split-pane Markdown editor with live preview
- Tag & category management
- Dashboard stats (post count, total views, etc.)
- Full CRUD for musings, books, issues, and roadmap items
- Token expiry: auto logout with toast notification, no manual localStorage cleanup needed

### Project Structure

```
full-stack-project/
├── frontend/                  # React frontend
│   └── src/
│       ├── api/               # Axios wrappers (with interceptors & error extraction)
│       ├── components/        # Shared components & layouts
│       ├── pages/             # Pages (including admin/)
│       ├── router/            # Routes & auth guard
│       ├── store/             # Zustand global state (auth / ui)
│       ├── types/             # TypeScript types
│       └── styles/            # CSS theme variables
├── backend/                   # Spring Boot backend
│   └── src/main/java/com/personalsite/blog/
│       ├── controller/        # REST controllers
│       ├── service/           # Business logic
│       ├── mapper/            # MyBatis-Plus mappers
│       ├── entity/            # Database entities
│       ├── dto/               # Request / response DTOs
│       ├── security/          # JWT auth filter
│       └── config/            # Spring configuration
├── docs/
│   └── troubleshooting/       # Troubleshooting guides
├── docker-compose.yml
└── README.md
```

### Local Development

#### Prerequisites

- Node.js 18+ · pnpm
- JDK 17+
- Maven 3.8+
- MySQL 8

#### 1. Initialize the Database

```bash
mysql -u root -p < backend/src/main/resources/schema.sql
```

This creates the `blog_db` database, all tables, the default admin account, and seed data.

#### 2. Configure the Database Connection

Edit `backend/src/main/resources/application-dev.yml`:

```yaml
spring:
  datasource:
    username: root           # your MySQL username
    password: your_password  # your MySQL password
```

#### 3. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

- Backend: `http://localhost:9090`
- Swagger UI: `http://localhost:9090/swagger-ui.html`

#### 4. Start the Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

- Frontend: `http://localhost:5173`

### Default Admin Credentials

| | |
|--|--|
| Login URL | `http://localhost:5173/admin/login` |
| Username | `admin` |
| Password | `Admin@123456` |

> ⚠️ Change the password immediately after your first deployment.

### Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/blog` | Blog list |
| `/blog/:slug` | Blog post detail |
| `/ai` | AI timeline |
| `/musings` | Musings |
| `/bookshelf` | Bookshelf |
| `/issues` | Issue Bin |
| `/roadmap` | Roadmap |
| `/about` | About |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard |
| `/admin/posts` | Post management |
| `/admin/posts/new` | Create new post |

### API Overview

**Public Endpoints**

```
GET  /api/posts                 Paginated & filtered post list
GET  /api/posts/:slug           Post detail
GET  /api/posts/ai-timeline     AI timeline entries
GET  /api/tags                  All tags
GET  /api/categories            All categories
GET  /api/musings               Musings list
GET  /api/books                 Bookshelf list
GET  /api/issues                Issue list
GET  /api/roadmap               Roadmap items
POST /api/auth/login            Admin login
```

**Admin Endpoints** (require `Authorization: Bearer <token>`)

```
GET    /api/admin/posts              All posts (including drafts)
POST   /api/admin/posts              Create post
PUT    /api/admin/posts/:id          Update post
DELETE /api/admin/posts/:id          Delete post
PATCH  /api/admin/posts/:id/publish  Toggle publish status
POST   /api/admin/tags               Create tag
DELETE /api/admin/tags/:id           Delete tag
POST   /api/admin/categories         Create category
DELETE /api/admin/categories/:id     Delete category
GET    /api/admin/stats              Dashboard stats

POST   /api/musings                  Create musing
PUT    /api/musings/:id              Update musing
PATCH  /api/musings/:id/toggle       Toggle todo done state
DELETE /api/musings/:id              Delete musing

POST   /api/books                    Add book
PUT    /api/books/:id                Update book
DELETE /api/books/:id                Delete book

POST   /api/issues                   Create issue
PUT    /api/issues/:id               Update issue
PATCH  /api/issues/:id/status        Update issue status
DELETE /api/issues/:id               Delete issue

POST   /api/roadmap                  Create roadmap item
PUT    /api/roadmap/:id              Update roadmap item
DELETE /api/roadmap/:id              Delete roadmap item
```

### Production Deployment

**Docker Compose (recommended)**

```bash
cp .env.example .env
# Fill in DB password and JWT secret in .env
docker compose up -d
```

**Manual**

```bash
# Build backend
cd backend
mvn package -DskipTests
java -jar target/blog-*.jar --spring.profiles.active=prod

# Build frontend
cd frontend
pnpm build
# Deploy dist/ to Nginx or any static host
```

**Backend environment variables**

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://your-host:3306/blog_db?useSSL=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4
SPRING_DATASOURCE_USERNAME=your_user
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your-random-secret-at-least-32-chars
JWT_EXPIRATION_MS=2592000000   # 30 days, adjust as needed
```

**Migrate to a cloud database**

```bash
# Export local data
mysqldump -u root -p blog_db > backup.sql
# Import to cloud
mysql -h cloud-host -u user -p blog_db < backup.sql
# Update SPRING_DATASOURCE_URL to point to the cloud host
```
