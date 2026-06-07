import React, { useEffect, useState } from 'react';
import { getPractices, createPractice, updatePractice, deletePractice } from '../../api/practice';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Practice, PracticeRequest } from '../../api/practice';
import type { PracticeStatus } from '../../constants/practiceStatus';

const EMPTY: PracticeRequest = { category: '', categoryIcon: '', name: '', status: 'todo', links: [], sortOrder: 0 };
const STATUS_LABEL: Record<string, string> = { todo: '待学习', in_progress: '学习中', mastered: '已掌握' };
const STATUS_COLOR: Record<string, string> = {
  todo: 'var(--color-text-muted)',
  in_progress: 'var(--color-neon-cyan)',
  mastered: '#22c55e',
};

const PracticeManagerPage: React.FC = () => {
  const [items, setItems] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Practice | null>(null);
  const [form, setForm] = useState<PracticeRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getPractices()
      .then((r) => setItems(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (p: Practice) => {
    setEditing(p);
    setForm({
      category: p.category,
      categoryIcon: p.categoryIcon ?? '',
      name: p.name,
      description: p.description ?? '',
      status: p.status,
      links: p.links ?? [],
      sortOrder: p.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.category.trim() || !form.name.trim()) { addToast('分类和名称不能为空', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await updatePractice(editing.id, form); addToast('已更新', 'success'); }
      else { await createPractice(form); addToast('已创建', 'success'); }
      setModalOpen(false); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`确认删除「${name}」？`)) return;
    try { await deletePractice(id); addToast('已删除', 'success'); load(); }
    catch (e: unknown) { const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error'); }
  };

  const addLink = () => {
    if ((form.links?.length ?? 0) >= 5) return;
    setForm((f) => ({ ...f, links: [...(f.links ?? []), { title: '', url: '' }] }));
  };
  const updateLink = (i: number, field: 'title' | 'url', val: string) => {
    setForm((f) => ({ ...f, links: (f.links ?? []).map((l, idx) => idx === i ? { ...l, [field]: val } : l) }));
  };
  const removeLink = (i: number) => {
    setForm((f) => ({ ...f, links: (f.links ?? []).filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">修炼手册管理</h1>
          <span className="admin-page-count">共 {items.length} 条</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={14} /> 新增条目</button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>分类</th><th>名称</th><th>状态</th><th>链接数</th><th style={{ width: 90 }}>操作</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={5} className="table-empty-row">暂无条目</td></tr>}
              {items.map((p) => (
                <tr key={p.id}>
                  <td><span className="table-category-chip">{p.categoryIcon} {p.category}</span></td>
                  <td className="table-title"><span className="table-title-link">{p.name}</span></td>
                  <td>
                    <span style={{ color: STATUS_COLOR[p.status], fontSize: '0.8rem', fontWeight: 600 }}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="table-views">{p.links?.length ?? 0}</td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(p)} title="编辑"><Pencil size={13} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(p.id, p.name)} title="删除"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminModal open={modalOpen} title={editing ? '编辑条目' : '新增条目'} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="editor-field">
            <label className="form-label">分类 *</label>
            <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="算法/前端/..." />
          </div>
          <div className="editor-field">
            <label className="form-label">分类图标（emoji）</label>
            <input value={form.categoryIcon ?? ''} onChange={(e) => setForm((f) => ({ ...f, categoryIcon: e.target.value }))} placeholder="🎯" />
          </div>
        </div>
        <div className="editor-field">
          <label className="form-label">名称 *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="条目名称" />
        </div>
        <div className="editor-field">
          <label className="form-label">描述</label>
          <textarea rows={2} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="可选" />
        </div>
        <div className="editor-field">
          <label className="form-label">状态</label>
          <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as PracticeStatus }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">待学习</SelectItem>
              <SelectItem value="in_progress">学习中</SelectItem>
              <SelectItem value="mastered">已掌握</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="editor-field">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>参考链接</label>
            <button className="btn btn-ghost btn-sm" onClick={addLink} disabled={(form.links?.length ?? 0) >= 5}><Plus size={12} /> 添加</button>
          </div>
          {(form.links ?? []).map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <input style={{ flex: 1 }} value={l.title} onChange={(e) => updateLink(i, 'title', e.target.value)} placeholder="标题" />
              <input style={{ flex: 2 }} value={l.url} onChange={(e) => updateLink(i, 'url', e.target.value)} placeholder="https://..." />
              <button className="action-btn delete" onClick={() => removeLink(i)} title="删除"><X size={12} /></button>
            </div>
          ))}
        </div>
      </AdminModal>
    </div>
  );
};

export default PracticeManagerPage;
