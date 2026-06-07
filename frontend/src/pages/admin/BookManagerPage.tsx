import React, { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../../api/books';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Book, BookRequest } from '../../api/books';
import type { BookStatus } from '../../constants/bookStatus';

const EMPTY: BookRequest = {
  title: '',
  author: '',
  status: 'want' as BookStatus,
  cover: '',
  review: '',
  category: '',
  rating: undefined,
  totalPages: undefined,
};

const STATUS_LABEL: Record<string, string> = { want: '想读', reading: '在读', done: '已读' };
const STATUS_COLOR: Record<string, string> = {
  want: 'var(--color-text-muted)',
  reading: 'var(--color-neon-cyan)',
  done: '#22c55e',
};

const BookManagerPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState<BookRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getBooks()
      .then((r) => setBooks(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (b: Book) => {
    setEditing(b);
    setForm({
      title: b.title,
      author: b.author,
      status: b.status,
      cover: b.cover ?? '',
      review: b.review ?? '',
      category: b.category ?? '',
      rating: b.rating,
      totalPages: b.totalPages,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.author.trim()) {
      addToast('书名和作者不能为空', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: BookRequest = {
        ...form,
        cover: form.cover?.trim() || undefined,
        review: form.review?.trim() || undefined,
        category: form.category?.trim() || undefined,
      };
      if (editing) {
        await updateBook(editing.id, payload);
        addToast('已更新', 'success');
      } else {
        await createBook(payload);
        addToast('已添加', 'success');
      }
      setModalOpen(false);
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败');
      if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!await showConfirm(`确认删除《${title}》？`)) return;
    try {
      await deleteBook(id);
      addToast('已删除', 'success');
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败');
      if (msg) addToast(msg, 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">书籍管理</h1>
          <span className="admin-page-count">共 {books.length} 本</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <Plus size={14} /> 添加书籍
        </button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>书名</th>
                <th>作者</th>
                <th>分类</th>
                <th>状态</th>
                <th>评分</th>
                <th style={{ width: 90 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 && (
                <tr><td colSpan={6} className="table-empty-row">暂无书籍</td></tr>
              )}
              {books.map((b) => (
                <tr key={b.id}>
                  <td className="table-title">
                    <span className="table-title-link">{b.title}</span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{b.author}</td>
                  <td><span className="table-category-chip">{b.category || '—'}</span></td>
                  <td>
                    <span style={{ color: STATUS_COLOR[b.status], fontSize: '0.8rem', fontWeight: 600 }}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </td>
                  <td className="table-views">{b.rating ? `${b.rating}★` : '—'}</td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(b)} title="编辑">
                      <Pencil size={13} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(b.id, b.title)} title="删除">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminModal
        open={modalOpen}
        title={editing ? '编辑书籍' : '添加书籍'}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      >
        <div className="editor-field">
          <label className="form-label">书名 *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="书名"
          />
        </div>
        <div className="editor-field">
          <label className="form-label">作者 *</label>
          <input
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            placeholder="作者"
          />
        </div>
        <div className="editor-field">
          <label className="form-label">分类</label>
          <input
            value={form.category ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="技术/文学/..."
          />
        </div>
        <div className="editor-field">
          <label className="form-label">状态</label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((f) => ({ ...f, status: v as BookStatus }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="want">想读</SelectItem>
              <SelectItem value="reading">在读</SelectItem>
              <SelectItem value="done">已读</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="editor-field">
          <label className="form-label">评分（1-5）</label>
          <input
            type="number"
            min={1}
            max={5}
            value={form.rating ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value ? Number(e.target.value) : undefined }))}
            placeholder="可选"
          />
        </div>
        <div className="editor-field">
          <label className="form-label">封面图 URL</label>
          <input
            value={form.cover ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
            placeholder="https://..."
          />
        </div>
        <div className="editor-field">
          <label className="form-label">短评</label>
          <textarea
            rows={3}
            value={form.review ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
            placeholder="可选"
          />
        </div>
      </AdminModal>
    </div>
  );
};

export default BookManagerPage;
