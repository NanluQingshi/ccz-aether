import React, { useMemo, useState } from 'react';
import {
  getBooks, createBook, updateBook, deleteBook,
  type Book, type BookRequest,
} from '../api/books';
import { getErrorMessage } from '../api/client';
import { Pencil, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { usePageData } from '../hooks/usePageData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/shadcn/Select';

type TabStatus = 'reading' | 'want' | 'done';
type DrawerMode = 'detail' | 'edit' | 'create';
type SortKey = 'createdAt' | 'finishedAt' | 'rating';

const TABS: { key: TabStatus; label: string }[] = [
  { key: 'reading', label: '在读' },
  { key: 'want',    label: '想读' },
  { key: 'done',    label: '已读' },
];

const EMPTY_FORM: BookRequest = {
  title: '', author: '', cover: '', status: 'want',
  rating: undefined, review: '', category: '',
  totalPages: undefined, readPages: undefined,
  startedAt: '', finishedAt: '',
};

function StarRating({ value, onChange }: { value?: number; onChange?: (v: number) => void }) {
  return (
    <div className="book-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`book-star ${n <= (value ?? 0) ? 'filled' : ''} ${onChange ? 'clickable' : ''}`}
          onClick={() => onChange?.(n)}
        >★</span>
      ))}
    </div>
  );
}

function BookCover({ book }: { book: Book }) {
  const [imgError, setImgError] = useState(false);
  if (book.cover && !imgError) {
    return <img src={book.cover} alt={book.title} className="book-cover-img" onError={() => setImgError(true)} />;
  }
  return (
    <div className="book-cover-placeholder">
      <span>{book.title.charAt(0)}</span>
    </div>
  );
}

const BookshelfPage: React.FC = () => {
  const { token } = useAuthStore();
  const { addToast, showConfirm } = useUiStore();
  const isAdmin = !!token;

  const { data: books, loading, setData: setBooks, reload: load } = usePageData(
    getBooks,
    () => addToast('加载失败', 'error'),
  );
  const [activeTab, setActiveTab] = useState<TabStatus>('reading');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');

  // 抽屉状态
  const [drawerBook, setDrawerBook] = useState<Book | null>(null);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('detail');
  const [form, setForm] = useState<BookRequest>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const closeDrawer = () => {
    setDrawerBook(null);
    setDrawerMode('detail');
  };

  const openDetail = (book: Book) => {
    setDrawerBook(book);
    setDrawerMode('detail');
  };

  const openCreate = () => {
    setDrawerBook(null);
    setForm(EMPTY_FORM);
    setDrawerMode('create');
  };

  const openEdit = (book: Book) => {
    setDrawerBook(book);
    setForm({
      title: book.title, author: book.author, cover: book.cover ?? '',
      status: book.status, rating: book.rating, review: book.review ?? '',
      category: book.category ?? '', totalPages: book.totalPages,
      readPages: book.readPages, startedAt: book.startedAt ?? '',
      finishedAt: book.finishedAt ?? '',
    });
    setDrawerMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    setSubmitting(true);
    const payload: BookRequest = {
      ...form,
      cover: form.cover || undefined,
      review: form.review || undefined,
      category: form.category || undefined,
      startedAt: form.startedAt || undefined,
      finishedAt: form.finishedAt || undefined,
    };
    try {
      if (drawerMode === 'edit' && drawerBook) {
        await updateBook(drawerBook.id, payload);
        addToast('已更新', 'success');
      } else {
        await createBook(payload);
        addToast('已添加', 'success');
      }
      closeDrawer();
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '操作失败'); if (msg) addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!await showConfirm('确认删除这本书？')) return;
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      closeDrawer();
      addToast('已删除', 'success');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  const setField = <K extends keyof BookRequest>(key: K, val: BookRequest[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleQuickProgress = async (book: Book, newReadPages: number) => {
    if (newReadPages < 0 || (book.totalPages != null && newReadPages > book.totalPages)) return;
    try {
      await updateBook(book.id, {
        title: book.title, author: book.author, cover: book.cover,
        status: book.status, rating: book.rating, review: book.review,
        category: book.category, totalPages: book.totalPages,
        readPages: newReadPages, startedAt: book.startedAt, finishedAt: book.finishedAt,
      });
      setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, readPages: newReadPages } : b));
      if (drawerBook?.id === book.id) {
        setDrawerBook((prev) => prev ? { ...prev, readPages: newReadPages } : prev);
      }
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '更新失败'); if (msg) addToast(msg, 'error');
    }
  };

  const categories = useMemo(
    () => Array.from(new Set(books.map((b) => b.category).filter(Boolean) as string[])).sort(),
    [books],
  );

  const tabBooks = useMemo(() => {
    const base = books
      .filter((b) => b.status === activeTab)
      .filter((b) => activeCategory === null || b.category === activeCategory);
    const sorted = [...base];
    if (sortKey === 'finishedAt') {
      sorted.sort((a, b) => (b.finishedAt ?? '').localeCompare(a.finishedAt ?? ''));
    } else if (sortKey === 'rating') {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else {
      sorted.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    }
    return sorted;
  }, [books, activeTab, activeCategory, sortKey]);

  const counts = useMemo(() => {
    const c = { reading: 0, want: 0, done: 0 } as Record<TabStatus, number>;
    books.forEach((b) => { if (b.status in c) c[b.status as TabStatus]++; });
    return c;
  }, [books]);

  const totalBooks = useMemo(() => books.filter((b) => b.status !== 'want').length, [books]);
  const doneThisYear = useMemo(() => {
    const thisYear = new Date().getFullYear().toString();
    return books.filter((b) => b.status === 'done' && b.finishedAt?.startsWith(thisYear)).length;
  }, [books]);
  const totalPages = useMemo(() => books.reduce((sum, b) => sum + (b.readPages ?? 0), 0), [books]);

  if (loading) return <LoadingSpinner fullPage />;

  const drawerOpen = drawerMode === 'create' || drawerBook !== null;

  // 表单 JSX（detail 和 create 共用）
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="issue-form book-drawer-form">
      <div className="book-form-row">
        <div className="form-group">
          <label className="form-label">书名 *</label>
          <input value={form.title} onChange={(e) => setField('title', e.target.value)} required placeholder="书名" />
        </div>
        <div className="form-group">
          <label className="form-label">作者 *</label>
          <input value={form.author} onChange={(e) => setField('author', e.target.value)} required placeholder="作者" />
        </div>
      </div>
      <div className="book-form-row">
        <div className="form-group">
          <label className="form-label">状态</label>
          <Select value={form.status} onValueChange={(v) => setField('status', v as BookRequest['status'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="want">想读</SelectItem>
              <SelectItem value="reading">在读</SelectItem>
              <SelectItem value="done">已读</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="form-group">
          <label className="form-label">分类</label>
          <input value={form.category} onChange={(e) => setField('category', e.target.value)} placeholder="如：技术 / 文学" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">封面图 URL</label>
        <input value={form.cover} onChange={(e) => setField('cover', e.target.value)} placeholder="可选" />
      </div>
      <div className="book-form-row">
        <div className="form-group">
          <label className="form-label">总页数</label>
          <input type="number" min={1} value={form.totalPages ?? ''} onChange={(e) => setField('totalPages', e.target.value ? Number(e.target.value) : undefined)} placeholder="可选" />
        </div>
        <div className="form-group">
          <label className="form-label">已读页数</label>
          <input type="number" min={0} value={form.readPages ?? ''} onChange={(e) => setField('readPages', e.target.value ? Number(e.target.value) : undefined)} placeholder="可选" />
        </div>
      </div>
      <div className="book-form-row">
        <div className="form-group">
          <label className="form-label">开始日期</label>
          <input type="date" value={form.startedAt} onChange={(e) => setField('startedAt', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">完成日期</label>
          <input type="date" value={form.finishedAt} onChange={(e) => setField('finishedAt', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">评分</label>
        <StarRating value={form.rating} onChange={(v) => setField('rating', v)} />
      </div>
      <div className="form-group">
        <label className="form-label">读后感</label>
        <textarea rows={5} value={form.review} onChange={(e) => setField('review', e.target.value)} placeholder="写写你的感受..." />
      </div>
      <div className="book-drawer-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => drawerBook ? setDrawerMode('detail') : closeDrawer()}>取消</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>{submitting ? '保存中...' : '保存'}</button>
      </div>
    </form>
  );

  return (
    <div className="container page-content">
      {/* Header */}
      <div className="bookshelf-header">
        <div>
          <h1 className="page-title">书页间</h1>
          <p className="bookshelf-subtitle">记录已读与在读书目，附上个人评分与读后感</p>
        </div>
        {isAdmin && (
          <button className="btn btn-soft" onClick={openCreate}>+ 添加</button>
        )}
      </div>

      {/* Stats */}
      <div className="bookshelf-stats">
        <div className="bookshelf-stat">
          <span className="bookshelf-stat-value">{totalBooks}</span>
          <span className="bookshelf-stat-label">在读 / 已读</span>
        </div>
        <div className="bookshelf-stat-divider" />
        <div className="bookshelf-stat">
          <span className="bookshelf-stat-value">{doneThisYear}</span>
          <span className="bookshelf-stat-label">{thisYear} 年读完</span>
        </div>
        <div className="bookshelf-stat-divider" />
        <div className="bookshelf-stat">
          <span className="bookshelf-stat-value">{totalPages.toLocaleString()}</span>
          <span className="bookshelf-stat-label">累计页数</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bookshelf-tabs-row">
        <div className="bookshelf-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`bookshelf-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setActiveCategory(null); setSortKey('createdAt'); }}
            >
              {tab.label}
              <span className="bookshelf-tab-count">{counts[tab.key]}</span>
            </button>
          ))}
        </div>
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger className="bookshelf-sort-select"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">添加时间</SelectItem>
            {activeTab === 'done' && <SelectItem value="finishedAt">完成日期</SelectItem>}
            {activeTab === 'done' && <SelectItem value="rating">评分</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="bookshelf-categories">
          <button className={`bookshelf-cat-chip ${activeCategory === null ? 'active' : ''}`} onClick={() => setActiveCategory(null)}>全部</button>
          {categories.map((cat) => (
            <button key={cat} className={`bookshelf-cat-chip ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}>{cat}</button>
          ))}
        </div>
      )}

      {/* Grid */}
      {tabBooks.length === 0 ? (
        <div className="empty-state">
          {activeTab === 'reading' && '还没有在读的书'}
          {activeTab === 'want' && '书单是空的，去加点书吧'}
          {activeTab === 'done' && '还没有读完的书'}
        </div>
      ) : (
        <div className="book-grid">
          {tabBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => openDetail(book)} style={{ cursor: 'pointer' }}>
              <div className="book-cover">
                <BookCover book={book} />
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                {book.category && <span className="book-category">{book.category}</span>}
                {book.rating != null && <StarRating value={book.rating} />}
                {book.totalPages != null && book.readPages != null && (
                  <div className="book-progress">
                    <div className="book-progress-bar">
                      <div className="book-progress-fill" style={{ width: `${Math.min(100, Math.round((book.readPages / book.totalPages) * 100))}%` }} />
                    </div>
                    <span className="book-progress-text">{book.readPages} / {book.totalPages} 页</span>
                  </div>
                )}
                {isAdmin && book.status === 'reading' && book.totalPages != null && (
                  <div className="book-quick-progress" onClick={(e) => e.stopPropagation()}>
                    <button className="book-progress-btn" onClick={() => handleQuickProgress(book, (book.readPages ?? 0) - 10)}>−10</button>
                    <button className="book-progress-btn" onClick={() => handleQuickProgress(book, (book.readPages ?? 0) - 1)}>−1</button>
                    <span className="book-progress-input-wrap">
                      <input className="book-progress-input" type="number" min={0} max={book.totalPages} value={book.readPages ?? 0}
                        onChange={(e) => handleQuickProgress(book, Number(e.target.value))} />
                    </span>
                    <button className="book-progress-btn" onClick={() => handleQuickProgress(book, (book.readPages ?? 0) + 1)}>+1</button>
                    <button className="book-progress-btn" onClick={() => handleQuickProgress(book, (book.readPages ?? 0) + 10)}>+10</button>
                  </div>
                )}
                {book.review && <p className="book-review">{book.review}</p>}
                {book.startedAt && !book.finishedAt && <p className="book-date">开始于 {book.startedAt}</p>}
                {book.finishedAt && <p className="book-date">读完于 {book.finishedAt}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="book-drawer-overlay" onClick={closeDrawer}>
          <div className="book-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="book-drawer-close" onClick={closeDrawer}><X size={18} /></button>

            {/* 新增模式 */}
            {drawerMode === 'create' && (
              <div className="book-drawer-body">
                <h3 className="book-drawer-title" style={{ marginBottom: '1rem' }}>添加书目</h3>
                {renderForm()}
              </div>
            )}

            {/* 详情模式 */}
            {drawerMode === 'detail' && drawerBook && (
              <>
                <div className="book-drawer-cover">
                  <BookCover book={drawerBook} />
                </div>
                <div className="book-drawer-body">
                  <h2 className="book-drawer-title">{drawerBook.title}</h2>
                  <p className="book-drawer-author">{drawerBook.author}</p>
                  <div className="book-drawer-meta">
                    {drawerBook.category && <span className="book-category">{drawerBook.category}</span>}
                    <span className={`book-drawer-status book-drawer-status-${drawerBook.status}`}>
                      {drawerBook.status === 'reading' ? '在读' : drawerBook.status === 'done' ? '已读' : '想读'}
                    </span>
                  </div>
                  {drawerBook.rating != null && <StarRating value={drawerBook.rating} />}
                  {drawerBook.totalPages != null && (
                    <div className="book-drawer-pages">
                      {drawerBook.readPages != null ? (
                        <div className="book-progress">
                          <div className="book-progress-bar">
                            <div className="book-progress-fill" style={{ width: `${Math.min(100, Math.round((drawerBook.readPages / drawerBook.totalPages) * 100))}%` }} />
                          </div>
                          <span className="book-progress-text">
                            {drawerBook.readPages} / {drawerBook.totalPages} 页 · {Math.round((drawerBook.readPages / drawerBook.totalPages) * 100)}%
                          </span>
                        </div>
                      ) : (
                        <p className="book-drawer-info-row"><span>总页数</span><span>{drawerBook.totalPages}</span></p>
                      )}
                    </div>
                  )}
                  {(drawerBook.startedAt || drawerBook.finishedAt) && (
                    <div className="book-drawer-dates">
                      {drawerBook.startedAt && <p className="book-drawer-info-row"><span>开始阅读</span><span>{drawerBook.startedAt}</span></p>}
                      {drawerBook.finishedAt && <p className="book-drawer-info-row"><span>读完日期</span><span>{drawerBook.finishedAt}</span></p>}
                    </div>
                  )}
                  {drawerBook.review && (
                    <div className="book-drawer-review">
                      <p className="book-drawer-review-label">读后感</p>
                      <p className="book-drawer-review-text">{drawerBook.review}</p>
                    </div>
                  )}
                  {isAdmin && (
                    <div className="book-drawer-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(drawerBook)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35em' }}><Pencil size={14} />编辑</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(drawerBook.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35em' }}><Trash2 size={14} />删除</button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 编辑模式 */}
            {drawerMode === 'edit' && drawerBook && (
              <div className="book-drawer-body">
                <h3 className="book-drawer-title" style={{ marginBottom: '1rem' }}>编辑书目</h3>
                {renderForm()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookshelfPage;
