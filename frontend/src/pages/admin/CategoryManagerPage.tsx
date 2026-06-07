import React, { useEffect, useState } from 'react';
import { getCategories, adminCreateCategory, adminDeleteCategory } from '../../api/categories';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Folder, Plus, Trash2 } from 'lucide-react';
import type { CategoryVO } from '../../types/category';

const EMPTY = { name: '', slug: '', description: '' };
const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const CategoryManagerPage: React.FC = () => {
  const [cats, setCats] = useState<CategoryVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getCategories()
      .then((r) => setCats(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name.trim()) { addToast('名称不能为空', 'error'); return; }
    setSaving(true);
    try {
      await adminCreateCategory(
        form.name.trim(),
        form.slug.trim() || toSlug(form.name),
        form.description.trim() || undefined,
      );
      addToast('分类已创建', 'success');
      setModalOpen(false);
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '创建失败');
      if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`确认删除分类「${name}」？关联文章将变为无分类。`)) return;
    try {
      await adminDeleteCategory(id);
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
          <h1 className="admin-page-title">分类管理</h1>
          <span className="admin-page-count">共 {cats.length} 个</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY); setModalOpen(true); }}>
          <Plus size={14} /> 新建分类
        </button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>名称</th><th>Slug</th><th>描述</th><th style={{ width: 80 }}>操作</th></tr>
            </thead>
            <tbody>
              {cats.length === 0 && <tr><td colSpan={4} className="table-empty-row">暂无分类</td></tr>}
              {cats.map((c) => (
                <tr key={c.id}>
                  <td className="table-title">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Folder size={14} style={{ color: 'var(--color-neon-cyan)', flexShrink: 0 }} />
                      {c.name}
                    </span>
                  </td>
                  <td><code style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{c.slug}</code></td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{c.description || '—'}</td>
                  <td className="table-actions">
                    <button className="action-btn delete" onClick={() => handleDelete(c.id, c.name)} title="删除">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminModal open={modalOpen} title="新建分类" onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div className="editor-field">
          <label className="form-label">名称 *</label>
          <input
            value={form.name}
            onChange={(e) => {
              const n = e.target.value;
              setForm((f) => ({ ...f, name: n, slug: toSlug(n) }));
            }}
            placeholder="前端开发"
          />
        </div>
        <div className="editor-field">
          <label className="form-label">Slug（URL 标识）</label>
          <input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="自动生成"
          />
        </div>
        <div className="editor-field">
          <label className="form-label">描述</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="可选"
          />
        </div>
      </AdminModal>
    </div>
  );
};

export default CategoryManagerPage;
