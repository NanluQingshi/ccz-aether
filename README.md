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

> 博客 × AI时间轴 × 随想录 × 书架 × Issue看板 × 技能修炼手册 × 公开Roadmap

前后端完全分离，Docker 一键部署，JWT 守护后台，Markdown 写作一气呵成。

---

## 🌐 中文

### 功能地图

```
┌─────────────────────────────────────────────────────────────────┐
│                         公开展示面                               │
├──────────┬──────────┬──────────┬──────────┬──────────┬─────────┤
│  🏠 主页  │  📝 博客  │  🤖 AI  │  💭 随想 │  📚 书架 │  ⚔️ 修炼 │
│  Hero区  │ 标签/分类 │  时间轴  │  月份归档 │ 进度追踪 │ 技能清单 │
│  技能展示 │ 分页浏览  │  年份分组 │ Todo管理 │ 评分书评 │  外链资源 │
├──────────┴──────────┴──────────┴──────────┴──────────┴─────────┤
│                                                                 │
│            🗂️ Issue看板  ·  🗺️ Roadmap  ·  👤 关于我            │
│          Todo/进行中/完成    进度条+分组      个人介绍              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     🔐 管理后台（JWT保护）                        │
├──────────┬──────────┬──────────────────────────────────────────┤
│  登录     │  仪表盘   │  文章/随想/书架/Issue/Roadmap/修炼 全CRUD │
│  30天免登 │  图表统计 │  分栏Markdown编辑器 · 实时预览             │
└──────────┴──────────┴──────────────────────────────────────────┘
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
║  MyBatis-Plus · MySQL 8 · JWT(JJWT 0.12.6)           ║
║  MapStruct · Lombok · SpringDoc OpenAPI               ║
╠══════════════════════════════════════════════════════╣
║  DEPLOYMENT                                          ║
║  Docker Compose · dev/prod profile · 健康检查         ║
╚══════════════════════════════════════════════════════╝
```

### 项目结构

```
full-stack-project/
├── frontend/                  # React 前端（Vite 构建）
│   └── src/
│       ├── api/               # 10 个 Axios API 模块 + 拦截器
│       ├── components/        # 可复用组件（blog/home/layout/ui）
│       ├── pages/             # 11 公开页面 + 4 Admin 页面
│       ├── router/            # 路由配置 + ProtectedRoute
│       ├── store/             # Zustand（auth + ui/toast）
│       ├── styles/            # theme / globals / components / markdown
│       └── types/             # TypeScript 类型定义
├── backend/                   # Spring Boot 后端（端口 9090）
│   └── src/main/java/com/personalsite/blog/
│       ├── controller/        # 10 个 REST 控制器
│       ├── service/           # 9 个业务服务
│       ├── entity/            # 10 个实体（含逻辑删除）
│       ├── security/          # JWT 工具 + 过滤器
│       ├── converter/         # MapStruct 对象转换
│       └── config/            # Security / WebMvc / MyBatis-Plus
│   └── src/main/resources/
│       ├── application.yml        # 主配置（dev/prod 切换）
│       ├── application-dev.yml    # 本地开发（SQL日志开）
│       ├── application-prod.yml   # 生产（环境变量注入）
│       └── schema.sql             # 数据库初始化 + 种子数据
├── docs/troubleshooting/      # 按模块归档的故障排查文档（5个）
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
| `/about` | 关于 | — |
| `/admin/login` | 管理员登录 | — |
| `/admin` | 仪表盘（图表统计） | ✅ |
| `/admin/posts` | 文章管理 | ✅ |
| `/admin/posts/new` | Markdown 编辑器 | ✅ |

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

# 随想录、书架、Issue、Roadmap、修炼手册
# 均支持完整 CRUD，路径形如 /api/{resource}/:id
```

### 📦 生产部署

下面这份流程适合把项目部署到一台 Linux 云服务器。文档里统一使用占位符，不包含任何真实服务器地址。

**先记住当前项目的部署形态**

- `docker-compose.yml` 目前只启动 `mysql` 和 `backend`
- 前端需要单独执行 `pnpm build`，再交给 Nginx 或其他静态资源服务托管
- `backend/src/main/resources/schema.sql` 会在 **MySQL 数据目录为空时** 自动建表并写入初始数据
- 如果你要迁移本地已有数据，建议先启动 MySQL，再导入备份，最后启动后端

**占位符说明**

| 占位符 | 含义 |
|------|------|
| `<SERVER_HOST>` | 云服务器公网 IP 或域名 |
| `<SSH_PORT>` | SSH 端口，默认 `22` |
| `<YOUR_REPO_URL>` | 代码仓库地址 |
| `<YOUR_DOMAIN>` | 前端对外访问域名，没有域名可先用服务器 IP |

#### 1. 连接云服务器

先确保云服务器安全组 / 防火墙已经放行至少这些端口：`22`、`80`、`443`、`9090`。

```bash
# 默认 22 端口
ssh root@<SERVER_HOST>

# 如果 SSH 端口不是 22
ssh -p <SSH_PORT> root@<SERVER_HOST>

# 如果使用密钥登录
ssh -i /path/to/private-key root@<SERVER_HOST>
```

#### 2. 安装 Docker 和 Compose

建议优先使用 **Docker 官方安装方式**。如果因为网络、系统源或环境原因失败，再使用 Ubuntu 自带包作为兜底方案。

**方案 A：官方安装方式（推荐）**

```bash
apt-get update
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
docker --version
docker compose version
systemctl status docker --no-pager | cat
```

**方案 B：Ubuntu 自带包（兜底方案）**

如果方案 A 失败，可以直接安装系统仓库版本：

```bash
apt-get update
apt-get install -y docker.io docker-compose
systemctl enable --now docker
docker --version
docker-compose --version
systemctl status docker --no-pager | cat
```

**如果你遇到这类报错**

- `Could not handshake`：服务器连 Docker 官方源失败，常见于国内云服务器网络环境
- `docker-ce has no installation candidate`：因为官方源索引没拉下来，`docker-ce` 包自然找不到
- `Unit docker.service not found` / `docker: command not found`：说明 Docker 根本还没安装成功

这时先移除失败的官方源配置，再走 Ubuntu 自带包安装：

```bash
rm -f /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker.io docker-compose
systemctl enable --now docker
docker --version
docker-compose --version
systemctl status docker --no-pager | cat
```

**怎么判断装好了**

- 能看到 `Docker version ...`
- 能看到 `Docker Compose version ...` 或 `docker-compose version ...`
- `systemctl status docker` 显示 `active (running)`

**`docker compose` 和 `docker-compose` 的区别**

- 官方安装方式通常使用 `docker compose`
- Ubuntu 自带包常见的是 `docker-compose`
- 如果你输入 `docker compose version` 报错，但 `docker-compose --version` 正常，就把后面文档里的命令替换成 `docker-compose`

**Docker 安装完成后先做这一步**

```bash
docker compose version || docker-compose --version
```

- 如果前半句成功，下面的 `<COMPOSE_CMD>` 就替换成 `docker compose`
- 如果后半句成功，下面的 `<COMPOSE_CMD>` 就替换成 `docker-compose`

**安装完成后的最短路径**

```text
确认 <COMPOSE_CMD> → 上传代码 → 创建 .env → 启动 MySQL → 导入本地数据（可选） → 启动 backend → 构建前端 → Nginx 托管 dist
```

#### 3. 上传项目代码到服务器

如果 Docker 已经安装完成，就从这里继续。

**方式 A：直接拉仓库（推荐）**

```bash
mkdir -p /opt
cd /opt
git clone <YOUR_REPO_URL> full-stack-project
cd /opt/full-stack-project
```

**方式 B：从本地上传项目目录**

```bash
scp -P <SSH_PORT> -r ./full-stack-project root@<SERVER_HOST>:/opt/
ssh -p <SSH_PORT> root@<SERVER_HOST>
cd /opt/full-stack-project
```

#### 4. 准备生产环境变量

先进入项目目录，再创建 `.env` 文件：

```bash
cd /opt/full-stack-project

cat > .env <<'EOF'
MYSQL_ROOT_PASSWORD=<strong-root-password>
MYSQL_PASSWORD=<strong-app-password>
JWT_SECRET=<32-plus-char-random-secret>
EOF
```

这三个值会被当前 `docker-compose.yml` 直接使用：

- `MYSQL_ROOT_PASSWORD`：MySQL root 密码
- `MYSQL_PASSWORD`：业务库用户 `blog_user` 的密码
- `JWT_SECRET`：JWT 签名密钥，至少 32 位

#### 5. 启动数据库与后端

这里开始统一使用 `<COMPOSE_CMD>` 表示 Compose 命令。请先把它替换成你机器上可用的那个：`docker compose` 或 `docker-compose`。

如果你是**全新部署**，直接启动即可：

```bash
<COMPOSE_CMD> up -d --build

<COMPOSE_CMD> ps
<COMPOSE_CMD> logs -f backend
```

如果你是**迁移本地已有数据**，建议按下面顺序操作：

```bash
# 先只启动数据库
<COMPOSE_CMD> up -d mysql

# 查看数据库是否健康
<COMPOSE_CMD> ps
```

> 首次启动时，MySQL 会自动执行 `backend/src/main/resources/schema.sql` 完成建表和初始化。

#### 6. 导出本地数据库并导入服务器

先在你的本地电脑导出当前数据库：

```bash
mysqldump \
  -h 127.0.0.1 \
  -P 3306 \
  -u <LOCAL_DB_USER> \
  -p \
  --default-character-set=utf8mb4 \
  --single-transaction \
  blog_db > blog_db_backup.sql
```

把备份文件传到服务器：

```bash
scp -P <SSH_PORT> blog_db_backup.sql root@<SERVER_HOST>:/opt/full-stack-project/
```

登录服务器后执行导入：

```bash
cd /opt/full-stack-project

docker exec -i blog_mysql sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" blog_db' < blog_db_backup.sql
```

导入完成后，再启动后端：

```bash
<COMPOSE_CMD> up -d backend
<COMPOSE_CMD> logs -f backend
```

#### 7. 验证后端是否可用

```bash
curl http://127.0.0.1:9090/actuator/health
```

如果返回健康状态，说明后端已经启动成功。对外访问时，地址格式如下：

```text
http://<SERVER_HOST>:9090
```

#### 8. 构建并部署前端

当前项目没有把前端放进 `docker-compose.yml`，所以前端需要单独构建。

先在本地或服务器上构建：

```bash
cd frontend
pnpm install
pnpm build
```

构建产物在 `frontend/dist/`。

如果你在本地构建，可以把产物上传到服务器：

```bash
scp -P <SSH_PORT> -r frontend/dist/* root@<SERVER_HOST>:/var/www/personal-site/
```

#### 9. 使用 Nginx 托管前端并反向代理后端

安装 Nginx：

```bash
apt update
apt install -y nginx
```

示例站点配置如下（请把域名占位符替换成你自己的域名或服务器地址）：

```nginx
server {
    listen 80;
    server_name <YOUR_DOMAIN>;

    root /var/www/personal-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:9090/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

写入配置并重载：

```bash
rm -f /etc/nginx/sites-enabled/default
cat > /etc/nginx/sites-available/personal-site <<'EOF'
server {
    listen 80;
    server_name <YOUR_DOMAIN>;

    root /var/www/personal-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:9090/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/personal-site /etc/nginx/sites-enabled/personal-site
nginx -t
systemctl reload nginx
```

#### 10. 生产环境注意事项

- 生产环境不要继续使用默认管理员密码，首次登录后立即修改
- 如果要严格限制跨域来源，记得把 `CORS_ALLOWED_ORIGINS` 传给后端容器
- `<COMPOSE_CMD> down` 不会删除 MySQL 数据卷；只有手动删除卷后，初始化 SQL 才会再次执行
- 如果只是更新后端代码，常用命令是 `<COMPOSE_CMD> up -d --build backend`
- 如果只是查看日志，使用 `<COMPOSE_CMD> logs -f backend` 或 `<COMPOSE_CMD> logs -f mysql`

**关键环境变量**

| 变量 | 说明 | 示例 |
|------|------|------|
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 | `<strong-root-password>` |
| `MYSQL_PASSWORD` | `blog_user` 密码 | `<strong-app-password>` |
| `JWT_SECRET` | JWT 签名密钥（至少32字符） | `<32-plus-char-random-secret>` |
| `JWT_EXPIRATION_MS` | Token 有效期（毫秒） | `2592000000` |
| `CORS_ALLOWED_ORIGINS` | 允许访问后端的前端来源 | `https://<YOUR_DOMAIN>` |

**Docker 安装完成后的最小发布顺序**

```text
确认 <COMPOSE_CMD> → 上传代码 → 创建 .env → 启动 MySQL → 导入备份（可选） → 启动 backend → 构建前端 → Nginx 托管 dist
```

**手动部署（不使用 Docker）**

```bash
# 后端打包
cd backend && mvn package -DskipTests
java -jar target/blog-*.jar --spring.profiles.active=prod

# 前端打包
cd frontend && pnpm install && pnpm build
```

**数据库迁移（最简版）**

```bash
# 本地导出
mysqldump -u <LOCAL_DB_USER> -p blog_db > blog_db_backup.sql

# 上传到服务器
scp -P <SSH_PORT> blog_db_backup.sql root@<SERVER_HOST>:/opt/full-stack-project/

# 服务器导入
ssh -p <SSH_PORT> root@<SERVER_HOST>
cd /opt/full-stack-project
docker exec -i blog_mysql sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" blog_db' < blog_db_backup.sql
```


### 🔧 故障排查

遇到问题先查 `docs/troubleshooting/`，按模块归档，救过无数个深夜：

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

> Blog × AI Timeline × Musings × Bookshelf × Issue Board × Skill Tracker × Public Roadmap

Full decoupled architecture, one-command Docker deployment, JWT-protected admin, pure Markdown writing flow.

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18 · TypeScript · Vite · Zustand · React Router v6 |
| Styling | Pure CSS custom properties — dark tech theme, zero UI framework |
| Markdown | react-markdown · rehype-highlight · @uiw/react-md-editor |
| Charts | Recharts |
| Backend | Java 17 · Spring Boot 3.3.4 · Spring Security · MyBatis-Plus |
| Database | MySQL 8 |
| Auth | JWT / JJWT 0.12.6 (single-admin, 30-day tokens) |
| Mapping | MapStruct |
| Deployment | Docker Compose |

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
| 👤 About | `/about` | About me |

**Admin Panel** (JWT protected)

- Full CRUD for posts, musings, books, issues, roadmap items, and practice entries
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

Edit `backend/src/main/resources/application-dev.yml` to set your MySQL credentials:

```yaml
spring:
  datasource:
    username: root
    password: your_password
```

#### Default Admin Credentials

| Field | Value |
|-------|-------|
| Login URL | `http://localhost:5173/admin/login` |
| Username | `admin` |
| Password | `Admin@123456` |

> ⚠️ **Change the password immediately after first deployment!**

### Routes

| Path | Description | Auth |
|------|-------------|:----:|
| `/` | Home | — |
| `/blog` | Blog list (tag/category filter) | — |
| `/blog/:slug` | Blog post detail | — |
| `/ai-timeline` | AI milestone timeline | — |
| `/musings` | Musings (ideas & todos) | — |
| `/bookshelf` | Bookshelf (3 status tabs) | — |
| `/issues` | Issue Kanban board | — |
| `/roadmap` | Feature roadmap | — |
| `/practice` | Skill practice tracker | — |
| `/about` | About | — |
| `/admin` | Dashboard | ✅ |
| `/admin/posts` | Post management | ✅ |
| `/admin/posts/new` | Markdown editor | ✅ |

### Production Deployment

A step-by-step cloud deployment guide is available in the Chinese section above. This project currently ships with:

- `mysql` + `backend` in `docker-compose.yml`
- frontend built separately with `pnpm build`
- initial schema loaded from `backend/src/main/resources/schema.sql` when MySQL data is empty

**Quick start**

1. Install Docker first. Prefer the official install method. If it fails, use the Ubuntu package fallback.
2. Run `docker compose version || docker-compose --version`.
3. If `docker compose` works, use it as `<COMPOSE_CMD>` below.
4. If only `docker-compose` works, replace `<COMPOSE_CMD>` with `docker-compose`.
5. After Docker is ready, continue with: upload code → create `.env` → start MySQL → import data if needed → start backend.

```bash
cd /opt/full-stack-project

cat > .env <<'EOF'
MYSQL_ROOT_PASSWORD=<strong-root-password>
MYSQL_PASSWORD=<strong-app-password>
JWT_SECRET=<32-plus-char-random-secret>
EOF

<COMPOSE_CMD> up -d --build
```

**Build frontend separately**

```bash
cd frontend
pnpm install
pnpm build
```

**Key Environment Variables**

| Variable | Description |
|----------|-------------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password |
| `MYSQL_PASSWORD` | Password for `blog_user` |
| `JWT_SECRET` | JWT signing key (32+ chars) |
| `JWT_EXPIRATION_MS` | Token TTL in ms |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |

**Database migration (minimal)**

```bash
mysqldump -u <LOCAL_DB_USER> -p blog_db > blog_db_backup.sql
scp -P <SSH_PORT> blog_db_backup.sql root@<SERVER_HOST>:/opt/full-stack-project/
docker exec -i blog_mysql sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" blog_db' < blog_db_backup.sql
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
```

---

*「写代码是写给人看的，顺便让机器执行。」*

Made with ☕ + 🎧 + way too many late nights.

</div>
