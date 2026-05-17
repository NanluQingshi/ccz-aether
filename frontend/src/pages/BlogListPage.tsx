import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPosts } from '../api/posts';
import { getTags } from '../api/tags';
import { getCategories } from '../api/categories';
import { PostCard } from '../components/blog/PostCard';
import { TagFilter } from '../components/blog/TagFilter';
import { Pagination } from '../components/ui/Pagination';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { PostVO } from '../types/post';
import type { TagVO } from '../types/tag';
import type { CategoryVO } from '../types/category';
import { useUiStore } from '../store/uiStore';

const BlogListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const tagSlug = searchParams.get('tag') || undefined;
  const categorySlug = searchParams.get('category') || undefined;

  const [posts, setPosts] = useState<PostVO[]>([]);
  const [tags, setTags] = useState<TagVO[]>([]);
  const [categories, setCategories] = useState<CategoryVO[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToast } = useUiStore();

  useEffect(() => {
    getTags().then((r) => setTags(r.data)).catch(() => {});
    getCategories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getPosts({ page, size: 10, tagSlug, categorySlug })
      .then((r) => {
        setPosts(r.data.records);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch(() => addToast('文章加载失败，请刷新重试', 'error'))
      .finally(() => setLoading(false));
  }, [page, tagSlug, categorySlug]);

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="container page-content">
      <h1 className="page-title">博客</h1>

      <div className="blog-layout">
        <aside className="blog-sidebar">
          <TagFilter
            tags={tags}
            activeSlug={tagSlug}
            onSelect={(s) => setParam('tag', s)}
          />
          <div className="filter-group" style={{ marginTop: '1.5rem' }}>
            <span className="filter-label">分类</span>
            <div className="filter-chips">
              <button
                className={`filter-chip ${!categorySlug ? 'active' : ''}`}
                onClick={() => setParam('category')}
              >
                全部
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`filter-chip ${categorySlug === c.slug ? 'active' : ''}`}
                  onClick={() => setParam('category', c.slug)}
                >
                  {c.name}
                  {c.postCount !== undefined && (
                    <span className="filter-count">{c.postCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="blog-main">
          <p className="blog-count">共 {total} 篇文章</p>
          {loading ? (
            <LoadingSpinner fullPage />
          ) : posts.length === 0 ? (
            <p className="empty-state">暂无文章</p>
          ) : (
            <>
              <div className="posts-list">
                {posts.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
              <Pagination
                page={page}
                pages={pages}
                onPageChange={(p) => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', String(p));
                  setSearchParams(params);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
