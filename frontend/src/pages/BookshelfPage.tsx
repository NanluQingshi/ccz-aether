import React, { useEffect, useState } from 'react';
import {
  getBooks, createBook, updateBook, deleteBook,
  type Book, type BookRequest,
} from '../api/books';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type TabStatus = 'reading' | 'want' | 'done';

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
  const { addToast } = useUiStore();
  const isAdmin = !!token;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>('reading');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BookRequest>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getBooks()
      .then((r) => setBooks(r.data))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (book: Book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      cover: book.cover ?? '',
      status: book.status,
      rating: book.rating,
      review: book.review ?? '',
      category: book.category ?? '',
      totalPages: book.totalPages,
      readPages: book.readPages,
      startedAt: book.startedAt ?? '',
      finishedAt: book.finishedAt ?? '',
    });
    setShowModal(true);
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
      if (editingId !== null) {
        await updateBook(editingId, payload);
        addToast('已更新', 'success');
      } else {
        await createBook(payload);
        addToast('已添加', 'success');
      }
      setShowModal(false);
      load();
    } catch {
      addToast('操作失败', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除？')) return;
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      addToast('已删除', 'success');
    } catch {
      addToast('删除失败', 'error');
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
        readPages: newReadPages,
        startedAt: book.startedAt, finishedAt: book.finishedAt,
      });
      setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, readPages: newReadPages } : b));
    } catch {
      addToast('更新失败', 'error');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const tabBooks = books.filter((b) => b.status === activeTab);
  const counts = { reading: 0, want: 0, done: 0 } as Record<TabStatus, number>;
  books.forEach((b) => { if (b.status in counts) counts[b.status as TabStatus]++; });

  const totalBooks = books.filter((b) => b.status !== 'want').length;
  const thisYear = new Date().getFullYear().toString();
  const doneThisYear = books.filter((b) => b.status === 'done' && b.finishedAt?.startsWith(thisYear)).length;
  const totalPages = books.reduce((sum, b) => sum + (b.readPages ?? 0), 0);

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
      <div className="bookshelf-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`bookshelf-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="bookshelf-tab-count">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

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
            <div key={book.id} className="book-card">
              <div className="book-cover">
                <BookCover book={book} />
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                {book.category && (
                  <span className="book-category">{book.category}</span>
                )}
                {book.rating != null && (
                  <StarRating value={book.rating} />
                )}
                {book.totalPages != null && book.readPages != null && (
                  <div className="book-progress">
                    <div className="book-progress-bar">
                      <div
                        className="book-progress-fill"
                        style={{ width: `${Math.min(100, Math.round((book.readPages / book.totalPages) * 100))}%` }}
                      />
                    </div>
                    <span className="book-progress-text">
                      {book.readPages} / {book.totalPages} 页
                    </span>
                  </div>
                )}
                {isAdmin && book.status === 'reading' && book.totalPages != null && (
                  <div className="book-quick-progress">
                    <button className="book-progress-btn" onClick={() => handleQuickProgress(book, (book.readPages ?? 0) - 10)}>−10</button>
                    <button className="book-progress-btn" onClick={() => handleQuickProgress(book, (book.readPages ?? 0) - 1)}>−1</button>
                    <span className="book-progress-input-wrap">
                      <input
                        className="book-progress-input"
                        type="number"
                        min={0}
                        max={book.totalPages}
                        value={book.readPages ?? 0}
                        onChange={(e) => handleQuickProgress(book, Number(e.target.value))}
                      />
                    </span>
                    <button className="book-progress-btn" onClick={() => handleQuickProgress(book, (book.readPages ?? 0) + 1)}>+1</button>
                    <button className="book-progress-btn" onClick={() => handleQuickProgress(book, (book.readPages ?? 0) + 10)}>+10</button>
                  </div>
                )}
                {book.review && (
                  <p className="book-review">{book.review}</p>
                )}
                {book.startedAt && !book.finishedAt && (
                  <p className="book-date">开始于 {book.startedAt}</p>
                )}
                {book.finishedAt && (
                  <p className="book-date">读完于 {book.finishedAt}</p>
                )}
              </div>
              {isAdmin && (
                <div className="book-card-actions">
                  <button className="musing-action-btn" onClick={() => openEdit(book)}>编辑</button>
                  <button className="musing-action-btn danger" onClick={() => handleDelete(book.id)}>删除</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="issue-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="issue-modal book-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="issue-modal-title">{editingId !== null ? '编辑书目' : '添加书目'}</h3>
            <form onSubmit={handleSubmit} className="issue-form">
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
                  <select value={form.status} onChange={(e) => setField('status', e.target.value as BookRequest['status'])}>
                    <option value="want">想读</option>
                    <option value="reading">在读</option>
                    <option value="done">已读</option>
                  </select>
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
                <textarea rows={4} value={form.review} onChange={(e) => setField('review', e.target.value)} placeholder="写写你的感受..." />
              </div>
              <div className="issue-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookshelfPage;
