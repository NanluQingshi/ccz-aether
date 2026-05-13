import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../../api/posts';
import { PostCard } from '../blog/PostCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { PostVO } from '../../types/post';

export const RecentPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts({ page: 1, size: 3 })
      .then((res) => setPosts(res.data.records))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">最新文章</h2>
        <Link to="/blog" className="section-more">查看全部 →</Link>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="posts-grid">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </section>
  );
};
