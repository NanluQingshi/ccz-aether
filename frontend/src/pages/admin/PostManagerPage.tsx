import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { adminGetPosts, adminDeletePost, adminTogglePublish } from '../../api/posts';
import { getErrorMessage } from '../../api/client';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Pagination } from '../../components/ui/Pagination';
import { useUiStore } from '../../store/uiStore';
import { Pencil, Trash2, Eye, EyeOff, FilePlus, Search, Trash } from 'lucide-react';
import type { PostVO } from '../../types/post';

type FilterStatus = 'all' | 'published' | 'draft';

const STATUS_TABS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'published', label: '已发布' },
  { key: 'draft', label: '草稿' },
];

const PostManagerPage: React.FC = () => {
  const [allPosts, setAllPosts] = useState<PostVO[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const { addToast, showConfirm } = useUiStore();

  const load = useCallback((p = 1) => {
    setLoading(true);
    setSelected(new Set());
    adminGetPosts(p, 10)
      .then((r) => {
        setAllPosts(r.data.records);
        setPages(r.data.pages);
        setTotal(r.data.total ?? r.data.records.length);
      })
      .catch(() => addToast('加载失败，请刷新重试', 'error'))
      .finally(() => setLoading(false));
  }, [addToast]);

  useEffect(() => { load(page); }, [page]);

  /* Client-side filter (on current page) */
  const filtered = allPosts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && p.status === 1) ||
      (filterStatus === 'draft' && p.status !== 1);
    return matchSearch && matchStatus;
  });

  /* Selection helpers */
  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };
  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  /* Actions */
  const handleDelete = async (id: number, title: string) => {
    if (!await showConfirm(`确认删除「${title}」？此操作不可撤销。`)) return;
    try {
      await adminDeletePost(id);
      addToast('已删除', 'success');
      load(page);
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await adminTogglePublish(id);
      addToast('状态已更新', 'success');
      load(page);
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '操作失败'); if (msg) addToast(msg, 'error');
    }
  };

  const handleBatchDelete = async () => {
    if (selected.size === 0) return;
    if (!await showConfirm(`确认删除选中的 ${selected.size} 篇文章？此操作不可撤销。`)) return;
    try {
      await Promise.all([...selected].map((id) => adminDeletePost(id)));
      addToast(`已删除 ${selected.size} 篇文章`, 'success');
      load(page);
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '批量删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">文章管理</h1>
          <span className="admin-page-count">共 {total} 篇</span>
        </div>
        <Link to="/admin/posts/new" className="btn btn-primary btn-sm">
          <FilePlus size={14} />
          <span>新建文章</span>
        </Link>
      </div>

      {/* Toolbar: search + filter tabs */}
      <div className="posts-toolbar">
        <div className="posts-filter-tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
              onClick={() => { setFilterStatus(tab.key); setSelected(new Set()); }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="posts-search-wrap">
          <Search size={14} className="posts-search-icon" />
          <input
            className="posts-search-input"
            placeholder="搜索标题..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Batch action bar */}
      {selected.size > 0 && (
        <div className="batch-action-bar">
          <span className="batch-selected-count">已选 {selected.size} 篇</span>
          <button className="btn btn-danger btn-sm" onClick={handleBatchDelete}>
            <Trash size={13} />
            <span>批量删除</span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSelected(new Set())}>
            取消选择
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      title="全选"
                      className="table-checkbox"
                    />
                  </th>
                  <th>标题</th>
                  <th>分类</th>
                  <th>状态</th>
                  <th>阅读</th>
                  <th>发布时间</th>
                  <th style={{ width: 120 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="table-empty-row">
                      {search ? `没有匹配「${search}」的文章` : '暂无文章'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className={selected.has(p.id) ? 'row-selected' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() => toggleOne(p.id)}
                          className="table-checkbox"
                        />
                      </td>
                      <td className="table-title">
                        <Link to={`/admin/posts/${p.id}/edit`} className="table-title-link">
                          {p.title}
                        </Link>
                        {p.summary && <p className="table-summary">{p.summary}</p>}
                      </td>
                      <td>
                        {p.category ? (
                          <span className="table-category-chip">{p.category.name}</span>
                        ) : '—'}
                      </td>
                      <td>
                        <span className={`status-badge ${p.status === 1 ? 'published' : 'draft'}`}>
                          {p.status === 1 ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="table-views">{p.viewCount.toLocaleString()}</td>
                      <td className="table-date">
                        {p.publishedAt ? format(new Date(p.publishedAt), 'yyyy-MM-dd') : '—'}
                      </td>
                      <td className="table-actions">
                        <Link to={`/admin/posts/${p.id}/edit`} className="action-btn edit" title="编辑">
                          <Pencil size={13} />
                        </Link>
                        <button
                          className="action-btn toggle"
                          onClick={() => handleToggle(p.id)}
                          title={p.status === 1 ? '取消发布' : '发布'}
                        >
                          {p.status === 1 ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(p.id, p.title)}
                          title="删除"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination-row">
            <span className="pagination-info">第 {page} / {pages} 页</span>
            <Pagination page={page} pages={pages} onPageChange={(p) => { setPage(p); }} />
          </div>
        </>
      )}
    </div>
  );
};

export default PostManagerPage;
