import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';
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
    let cancelled = false;
    setLoading(true);
    getPostBySlug(slug)
      .then((r) => { if (!cancelled) setPost(r.data); })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
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

  const description = post.summary ?? post.content.slice(0, 160).replace(/[#*`>\[\]]/g, '');
  const ogImage = post.coverImage ?? '';

  return (
    <div className="container page-content">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {post.publishedAt && <meta property="article:published_time" content={new Date(post.publishedAt).toISOString()} />}
      </Helmet>

      <Link to="/blog" className="back-link"><ArrowLeft size={15} /> 返回博客</Link>

      <article className="post-detail">
        {post.category && (
          <div className="post-detail-category">{post.category.name}</div>
        )}
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span><Calendar size={13} />{post.publishedAt ? format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: zhCN }) : ''}</span>
          <span><Eye size={13} />{post.viewCount} 阅读</span>
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
