import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { adminGetPosts, adminDeletePost, adminTogglePublish } from '../../api/posts';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Pagination } from '../../components/ui/Pagination';
import { useUiStore } from '../../store/uiStore';
import type { PostVO } from '../../types/post';

const PostManagerPage: React.FC = () => {
  const [posts, setPosts] = useState<PostVO[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToast } = useUiStore();

  const load = (p = page) => {
    setLoading(true);
    adminGetPosts(p, 10)
      .then((r) => {
        setPosts(r.data.records);
        setPages(r.data.pages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`确认删除「${title}」？`)) return;
    await adminDeletePost(id);
    addToast('已删除', 'success');
    load();
  };

  const handleToggle = async (id: number) => {
    await adminTogglePublish(id);
    addToast('状态已更新', 'success');
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">文章管理</h1>
        <Link to="/admin/posts/new" className="btn btn-primary">+ 新建文章</Link>
      </div>

      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>分类</th>
                  <th>状态</th>
                  <th>阅读</th>
                  <th>发布时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td className="table-title">
                      <span>{p.title}</span>
                    </td>
                    <td>{p.category?.name ?? '—'}</td>
                    <td>
                      <span className={`status-badge ${p.status === 1 ? 'published' : 'draft'}`}>
                        {p.status === 1 ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td>{p.viewCount}</td>
                    <td>
                      {p.publishedAt
                        ? format(new Date(p.publishedAt), 'yyyy-MM-dd')
                        : '—'}
                    </td>
                    <td className="table-actions">
                      <Link to={`/admin/posts/${p.id}/edit`} className="action-btn edit">编辑</Link>
                      <button
                        className="action-btn toggle"
                        onClick={() => handleToggle(p.id)}
                      >
                        {p.status === 1 ? '取消发布' : '发布'}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(p.id, p.title)}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default PostManagerPage;
