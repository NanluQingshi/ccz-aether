import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Eye } from 'lucide-react';
import type { PostVO } from '../../types/post';

interface PostCardProps {
  post: PostVO;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => (
  <article className="post-card">
    {post.coverImage && (
      <div className="post-card-cover">
        <img src={post.coverImage} alt={post.title} />
      </div>
    )}
    <div className="post-card-body">
      {post.category && (
        <span className="post-card-category">{post.category.name}</span>
      )}
      <h2 className="post-card-title">
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      {post.summary && <p className="post-card-summary">{post.summary}</p>}
      <div className="post-card-meta">
        <span className="post-card-date">
          <Calendar size={12} />
          {post.publishedAt
            ? format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: zhCN })
            : '草稿'}
        </span>
        <span className="post-card-views"><Eye size={12} />{post.viewCount}</span>
      </div>
      {post.tags.length > 0 && (
        <div className="post-card-tags">
          {post.tags.map((tag) => (
            <span key={tag.id} className="tag">{tag.name}</span>
          ))}
        </div>
      )}
    </div>
  </article>
);
