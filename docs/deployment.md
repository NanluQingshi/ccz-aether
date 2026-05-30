# 部署指南

技术栈：Nginx（前端静态文件 + 反向代理）+ Docker Compose（MySQL + Spring Boot）

---

## 架构说明

```
用户请求
  ↓
Nginx :80
  ├── /          → 前端静态文件 /var/www/blog/dist
  └── /api/*     → 反向代理 → 后端容器 :9090
                                  ↓
                             MySQL 容器 :3306
```

---

## 一、本地准备

### 1.1 配置生产环境变量

编辑 `frontend/.env.production`，填入服务器域名或公网 IP：

```
VITE_API_BASE_URL=https://yourdomain.com
```

编辑 `deploy/nginx.conf`，同步修改 `server_name`：

```nginx
server_name yourdomain.com;
```

### 1.2 构建前端

```bash
cd frontend
pnpm build
# 产物输出到 frontend/dist/
```

### 1.3 导出本地数据库

```bash
mysqldump -u root -p123456 blog_db > ~/blog_backup.sql
```

### 1.4 上传文件到服务器

```bash
# 上传项目代码（排除无关目录）
rsync -avz \
  --exclude='frontend/node_modules' \
  --exclude='backend/target' \
  --exclude='frontend/dist' \
  /path/to/full-stack-project/ \
  user@yourserver:/opt/blog/

# 单独上传前端构建产物
scp -r frontend/dist/ user@yourserver:/var/www/blog/dist/

# 上传数据库备份
scp ~/blog_backup.sql user@yourserver:~/
```

---

## 二、服务器初始化（首次部署）

### 2.1 安装 Docker 和 Nginx

```bash
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && newgrp docker

# Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Nginx
sudo apt install -y nginx
```

### 2.2 配置环境变量

```bash
cd /opt/blog
cp deploy/.env.example .env

# 用编辑器填入真实值
nano .env
```

`.env` 内容说明：

| 变量 | 说明 |
|------|------|
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 |
| `MYSQL_PASSWORD` | 应用连接 MySQL 的密码 |
| `JWT_SECRET` | JWT 签名密钥，至少 32 字符 |
| `CORS_ALLOWED_ORIGINS` | 前端域名，多个用逗号分隔 |

生成 JWT_SECRET 的命令：

```bash
openssl rand -hex 32
```

### 2.3 启动后端容器

```bash
cd /opt/blog
docker compose up -d --build

# 查看启动日志，确认无报错
docker compose logs -f --tail=100
```

### 2.4 导入历史数据

等待 MySQL 容器健康（约 30 秒）后执行：

```bash
docker exec -i blog_mysql mysql \
  -u blog_user -p$(grep MYSQL_PASSWORD .env | cut -d= -f2) \
  blog_db < ~/blog_backup.sql
```

### 2.5 配置 Nginx

```bash
# 确保静态文件目录存在
sudo mkdir -p /var/www/blog

# 复制 Nginx 配置
sudo cp /opt/blog/deploy/nginx.conf /etc/nginx/sites-available/blog
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
sudo rm -f /etc/nginx/sites-enabled/default

# 检查配置语法并重启
sudo nginx -t && sudo systemctl restart nginx
```

### 2.6 开放防火墙

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# 9090 端口不需要对外暴露，Nginx 内部转发
```

---

## 三、验证部署

| 地址 | 预期结果 |
|------|---------|
| `http://yourdomain.com` | 前端首页正常加载 |
| `http://yourdomain.com/api/posts` | 返回博客列表 JSON |
| `http://yourdomain.com/admin/login` | 管理后台登录页 |

如果页面空白或接口报错，优先检查：

```bash
# 后端容器状态
docker compose ps
docker compose logs backend --tail=50

# Nginx 错误日志
sudo tail -50 /var/log/nginx/error.log
```

---

## 四、后续更新

### 更新后端

```bash
cd /opt/blog
git pull
docker compose up -d --build backend
```

### 更新前端

本地重新构建后上传：

```bash
# 本地
cd frontend && pnpm build
scp -r dist/ user@yourserver:/var/www/blog/dist/
```

### 更新数据库结构

手动执行 DDL，或将增量 SQL 文件导入容器：

```bash
docker exec -i blog_mysql mysql \
  -u blog_user -p<password> blog_db < migration.sql
```

---

## 五、HTTPS 配置（可选）

使用 Certbot 申请免费 SSL 证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
# 按提示完成，Certbot 会自动修改 nginx.conf 加上 443 配置
```

证书每 90 天自动续期，测试续期命令：

```bash
sudo certbot renew --dry-run
```
