import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getPostBySlug } from '../api/posts';
import { MarkdownRenderer } from '../components/blog/MarkdownRenderer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { PostDetailVO } from '../types/post';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetailVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug)
      .then((r) => setPost(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner fullPage />;
  if (notFound || !post) {
    return (
      <div className="container page-content">
        <p className="empty-state">文章不存在</p>
        <Link to="/blog" className="btn btn-ghost">← 返回博客</Link>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <Link to="/blog" className="back-link">← 返回博客</Link>

      <article className="post-detail">
        {post.category && (
          <div className="post-detail-category">{post.category.name}</div>
        )}
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span>
            {post.publishedAt
              ? format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: zhCN })
              : ''}
          </span>
          <span>{post.viewCount} 阅读</span>
          {post.tags.length > 0 && (
            <div className="post-detail-tags">
              {post.tags.map((t) => (
                <span key={t.id} className="tag">{t.name}</span>
              ))}
            </div>
          )}
        </div>

        {post.coverImage && (
          <img className="post-detail-cover" src={post.coverImage} alt={post.title} />
        )}

        <MarkdownRenderer content={post.content} />
      </article>
    </div>
  );
};

export default BlogDetailPage;
