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

-- Migration: add type and event_date to existing post table (safe to run on existing DB)
ALTER TABLE `post`
  ADD COLUMN IF NOT EXISTS `type`       VARCHAR(32) NOT NULL DEFAULT 'blog' COMMENT 'blog | ai_timeline' AFTER `cover_image`,
  ADD COLUMN IF NOT EXISTS `event_date` DATE        COMMENT 'AI 大事纪事件日期' AFTER `type`,
  ADD INDEX IF NOT EXISTS `idx_type_event_date` (`type`, `event_date` DESC);
