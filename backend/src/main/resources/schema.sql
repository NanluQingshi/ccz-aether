CREATE DATABASE IF NOT EXISTS blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog_db;

CREATE TABLE IF NOT EXISTS `user` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT,
  `username`   VARCHAR(64)  NOT NULL,
  `password`   VARCHAR(255) NOT NULL COMMENT 'BCrypt hash',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `category` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(64)  NOT NULL,
  `slug`        VARCHAR(64)  NOT NULL,
  `description` VARCHAR(255),
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tag` (
  `id`         BIGINT      NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(64) NOT NULL,
  `slug`       VARCHAR(64) NOT NULL,
  `created_at` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `post` (
  `id`           BIGINT        NOT NULL AUTO_INCREMENT,
  `title`        VARCHAR(255)  NOT NULL,
  `slug`         VARCHAR(255)  NOT NULL,
  `summary`      VARCHAR(512),
  `content`      LONGTEXT      NOT NULL COMMENT 'Raw Markdown',
  `cover_image`  VARCHAR(512),
  `category_id`  BIGINT,
  `type`         VARCHAR(32)   NOT NULL DEFAULT 'blog' COMMENT 'blog | ai_timeline',
  `event_date`   DATE          COMMENT 'AI 大事纪事件日期（仅 type=ai_timeline 时使用）',
  `status`       TINYINT       NOT NULL DEFAULT 0 COMMENT '0=draft,1=published',
  `view_count`   INT           NOT NULL DEFAULT 0,
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `published_at` DATETIME,
  `deleted`      TINYINT       NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  INDEX `idx_status_published` (`status`, `published_at` DESC),
  INDEX `idx_type_event_date` (`type`, `event_date` DESC),
  INDEX `idx_category` (`category_id`),
  FULLTEXT INDEX `ft_title_content` (`title`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `post_tag` (
  `post_id` BIGINT NOT NULL,
  `tag_id`  BIGINT NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`)  REFERENCES `tag`(`id`)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin user: admin / Admin@123456
-- Password BCrypt hash generated with strength 12
INSERT IGNORE INTO `user` (`username`, `password`) VALUES (
  'admin',
  '$2a$12$8lpqXbN1qxT1rHmLd1eJmuEE2JCmJcuLpnSoxBaJKD0ikOihJcMAi'
);

-- Default categories
INSERT IGNORE INTO `category` (`name`, `slug`, `description`) VALUES
  ('技术笔记', 'tech-notes', '技术学习与实践记录'),
  ('随笔', 'essays', '日常随想与生活感悟');

-- Default tags
INSERT IGNORE INTO `tag` (`name`, `slug`) VALUES
  ('Java', 'java'),
  ('Spring Boot', 'spring-boot'),
  ('React', 'react'),
  ('TypeScript', 'typescript'),
  ('MySQL', 'mysql'),
  ('Docker', 'docker');

CREATE TABLE IF NOT EXISTS `issue` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status`      TINYINT      NOT NULL DEFAULT 0  COMMENT '0=todo,1=in_progress,2=done',
  `priority`    TINYINT      NOT NULL DEFAULT 1  COMMENT '0=low,1=medium,2=high',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `musing` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT,
  `content`    TEXT         NOT NULL,
  `type`       VARCHAR(16)  NOT NULL DEFAULT 'idea' COMMENT 'idea | todo',
  `done`       TINYINT      NOT NULL DEFAULT 0       COMMENT '0=open,1=done',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `book` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(255) NOT NULL,
  `author`      VARCHAR(128) NOT NULL,
  `cover`       VARCHAR(512) COMMENT '封面图 URL，可为空',
  `status`      VARCHAR(16)  NOT NULL DEFAULT 'want' COMMENT 'want|reading|done',
  `rating`      TINYINT      COMMENT '1-5，仅 done 状态填写',
  `review`      TEXT         COMMENT '读后感',
  `category`    VARCHAR(64)  COMMENT '分类，如：技术/文学/历史',
  `total_pages` INT          COMMENT '总页数',
  `read_pages`  INT          COMMENT '已读页数，仅 reading 状态使用',
  `started_at`  DATE         COMMENT '开始阅读日期',
  `finished_at` DATE         COMMENT '完成日期',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `roadmap_item` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT,
  `group_label` VARCHAR(64)  NOT NULL COMMENT '分组名称，如：内容、功能、体验',
  `group_icon`  VARCHAR(16)  COMMENT '分组图标字符',
  `name`        VARCHAR(128) NOT NULL COMMENT '功能名称',
  `description` VARCHAR(512) COMMENT '功能描述',
  `status`      VARCHAR(16)  NOT NULL DEFAULT 'planned' COMMENT 'done | planned',
  `priority`    VARCHAR(16)  COMMENT 'high | medium | low，planned 时使用',
  `sort_order`  INT          NOT NULL DEFAULT 0 COMMENT '同组内排序',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_group_sort` (`group_label`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `roadmap_item` (`group_label`, `group_icon`, `name`, `description`, `status`, `priority`, `sort_order`) VALUES
  ('内容', '◈', '技术博客',     'Markdown 写作，代码高亮，标签 / 分类筛选',                   'done',    NULL,     1),
  ('内容', '◈', 'AI 大事纪',   '竖向时间轴，按年份分组，记录 AI 发展里程碑',                   'done',    NULL,     2),
  ('内容', '◈', 'Issue Bin',   '记录暂时无法解决的技术问题，方便后续追踪与复盘',               'done',    NULL,     3),
  ('内容', '◈', '书页间',       '记录已读与在读书目，附上个人评分与读后感',                     'done',    NULL,     4),
  ('内容', '◈', '随想录',       '随手记录灵感、念头与阶段计划，不设格式，想到就写',             'done',    NULL,     5),
  ('内容', '◈', '评论系统',     '访客可在博客文章下留言互动',                                   'planned', 'medium', 6),
  ('内容', '◈', 'RSS Feed',    '输出标准 RSS，方便订阅工具抓取',                               'planned', 'low',    7),
  ('内容', '◈', '知识库',       '整理、沉淀个人技术笔记与学习资料，支持分类检索',               'planned', 'low',    8),
  ('内容', '◈', '修炼手册',     '制定个人学习计划，追踪各方向的学习进度与阶段目标',             'planned', 'low',    9),
  ('内容', '◈', '个人 Todo',   '日常事项与目标追踪，和网站功能无关的个人待办',                 'planned', 'low',    10),
  ('功能', '⚙', 'Markdown 编辑器', '分栏实时预览，后台写作体验',                              'done',    NULL,     1),
  ('功能', '⚙', '标签 / 分类管理', '多维度组织文章内容',                                      'done',    NULL,     2),
  ('功能', '⚙', '全文搜索',     '快速检索站内所有文章',                                        'planned', 'high',   3),
  ('功能', '⚙', '图片上传',     '支持本地存储或 S3，告别外链依赖',                             'planned', 'medium', 4),
  ('管理后台', '⊞', 'JWT 认证', '单管理员登录，Token 鉴权',                                   'done',    NULL,     1),
  ('管理后台', '⊞', '文章管理', '创建、编辑、删除、发布一站式管理',                             'done',    NULL,     2),
  ('管理后台', '⊞', '仪表盘统计', '文章数、阅读量等核心数据一览',                              'done',    NULL,     3),
  ('管理后台', '⊞', '访问统计看板', '更详细的 PV / UV 与热门文章分析',                        'planned', 'low',    4),
  ('体验', '✦', '暗色科技感主题', '全站统一的深色 UI，霓虹青 / 紫双主色',                     'done',    NULL,     1),
  ('体验', '✦', '响应式布局',   '适配移动端、平板、桌面多种屏幕',                               'done',    NULL,     2),
  ('体验', '✦', '明暗主题切换', '用户可自由切换 Dark / Light 模式',                            'planned', 'medium', 3),
  ('部署', '⬡', 'Docker Compose', '一键启动 MySQL + 后端容器',                               'done',    NULL,     1),
  ('部署', '⬡', '云数据库支持', '通过环境变量无缝切换本地 / 云端 MySQL',                    'done',    NULL,     2);

-- Migration: add type and event_date to existing post table
-- NOTE: run only once on an existing DB; skip if columns already exist
ALTER TABLE `post`
  ADD COLUMN `type`       VARCHAR(32) NOT NULL DEFAULT 'blog' COMMENT 'blog | ai_timeline' AFTER `cover_image`,
  ADD COLUMN `event_date` DATE        COMMENT 'AI 大事纪事件日期' AFTER `type`;

ALTER TABLE `post`
  ADD INDEX `idx_type_event_date` (`type`, `event_date` DESC);
