# Personal Site

> 个人网站 · 技术博客 · AI 大事纪  
> A personal website featuring a tech blog and an AI timeline, built with a modern full-stack architecture.

[中文](#中文) · [English](#english)

---

## 中文

### 项目简介

一个持续成长的个人网站，目前包含技术博客与 AI 大事纪两个板块，后续会持续扩展。支持 Markdown 写作、标签与分类管理，以及统一的后台管理系统。前后端分离，部署灵活。

### 技术栈

| 层级 | 技术选型 |
|------|---------|
| 前端 | React 18 · TypeScript · Vite · Zustand · React Router v6 |
| 样式 | 纯 CSS 自定义属性（暗色科技感主题，无 UI 框架依赖） |
| Markdown | react-markdown · rehype-highlight · @uiw/react-md-editor |
| 后端 | Java 17 · Spring Boot 3 · Spring Security · MyBatis-Plus |
| 数据库 | MySQL 8（支持全文检索） |
| 认证 | JWT（单管理员模式） |
| 部署 | Docker Compose |

### 功能特性

**公开页面**
- 首页：个人介绍、技能展示、最新文章
- 博客列表：分页浏览，按标签 / 分类筛选
- 博客详情：Markdown 渲染，代码语法高亮，标题锚点
- AI 大事纪：竖向时间轴，按年份分组，记录 AI 发展里程碑
- 关于页

**后台管理**（需登录）
- 文章管理：创建 / 编辑 / 删除 / 发布，支持普通博客与 AI 大事纪两种类型
- Markdown 分栏编辑器，实时预览
- 标签与分类管理
- 仪表盘统计（文章数、阅读量等）

### 项目结构

```
full-stack-project/
├── frontend/                  # React 前端
│   └── src/
│       ├── api/               # Axios 封装
│       ├── components/        # 通用组件 & 布局
│       ├── pages/             # 页面（含 admin/）
│       ├── router/            # 路由 & 权限守卫
│       ├── store/             # Zustand 全局状态
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

- 后端地址：`http://localhost:8080`
- Swagger UI：`http://localhost:8080/swagger-ui.html`

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
```

**迁移到云数据库**

```bash
# 1. 导出本地数据
mysqldump -u root -p blog_db > backup.sql
# 2. 导入到云端
mysql -h cloud-host -u user -p blog_db < backup.sql
# 3. 更新 SPRING_DATASOURCE_URL 指向云端地址
```

### 后续扩展方向

- [ ] 博客评论系统
- [ ] 全文搜索（升级 MeiliSearch）
- [ ] 图片上传（本地 / S3）
- [ ] RSS Feed
- [ ] 明暗主题切换
- [ ] 访问统计看板

---

## English

### Overview

A growing personal website, currently featuring a tech blog and an AI milestone timeline, with more sections planned. Supports Markdown writing, tag & category management, and a unified admin dashboard. Decoupled frontend and backend, flexible deployment.

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18 · TypeScript · Vite · Zustand · React Router v6 |
| Styling | Pure CSS custom properties (dark tech theme, no UI framework) |
| Markdown | react-markdown · rehype-highlight · @uiw/react-md-editor |
| Backend | Java 17 · Spring Boot 3 · Spring Security · MyBatis-Plus |
| Database | MySQL 8 (with full-text search support) |
| Auth | JWT (single-admin model) |
| Deployment | Docker Compose |

### Features

**Public Pages**
- Home: personal intro, skills, recent posts
- Blog list: paginated, filterable by tag / category
- Blog detail: Markdown rendering, syntax highlighting, heading anchors
- AI Timeline: vertical timeline grouped by year, tracking AI milestones
- About page

**Admin Panel** (login required)
- Post management: create / edit / delete / publish, supporting both blog posts and AI timeline entries
- Split-pane Markdown editor with live preview
- Tag & category management
- Dashboard stats (post count, total views, etc.)

### Project Structure

```
full-stack-project/
├── frontend/                  # React frontend
│   └── src/
│       ├── api/               # Axios wrappers
│       ├── components/        # Shared components & layouts
│       ├── pages/             # Pages (including admin/)
│       ├── router/            # Routes & auth guard
│       ├── store/             # Zustand global state
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

- Backend: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

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
```

**Migrate to a cloud database**

```bash
# Export local data
mysqldump -u root -p blog_db > backup.sql
# Import to cloud
mysql -h cloud-host -u user -p blog_db < backup.sql
# Update SPRING_DATASOURCE_URL to point to the cloud host
```

### Roadmap

- [ ] Comment system
- [ ] Full-text search (MeiliSearch upgrade)
- [ ] Image upload (local / S3)
- [ ] RSS Feed
- [ ] Dark / light theme toggle
- [ ] Analytics dashboard
