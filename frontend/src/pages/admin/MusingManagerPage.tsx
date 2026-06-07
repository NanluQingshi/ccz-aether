import React, { useEffect, useState } from 'react';
import { getMusings, createMusing, updateMusing, toggleMusingDone, deleteMusing } from '../../api/musings';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import { format } from 'date-fns';
import type { Musing, MusingRequest } from '../../api/musings';

const EMPTY: MusingRequest = { content: '', type: 'idea' };

const MusingManagerPage: React.FC = () => {
  const [musings, setMusings] = useState<Musing[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Musing | null>(null);
  const [form, setForm] = useState<MusingRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getMusings()
      .then((r) => setMusings(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (m: Musing) => {
    setEditing(m);
    setForm({ content: m.content, type: m.type });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.content.trim()) { addToast('内容不能为空', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await updateMusing(editing.id, form); addToast('已更新', 'success'); }
      else { await createMusing(form); addToast('已创建', 'success'); }
      setModalOpen(false); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleMusingDone(id);
      setMusings((prev) => prev.map((m) => m.id === id ? { ...m, done: m.done ? 0 : 1 } : m));
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '操作失败'); if (msg) addToast(msg, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!await showConfirm('确认删除这条随想？')) return;
    try { await deleteMusing(id); addToast('已删除', 'success'); load(); }
    catch (e: unknown) { const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error'); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">随想录管理</h1>
          <span className="admin-page-count">共 {musings.length} 条</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={14} /> 新建随想</button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>内容</th><th>类型</th><th>完成</th><th>创建时间</th><th style={{ width: 90 }}>操作</th></tr>
            </thead>
            <tbody>
              {musings.length === 0 && <tr><td colSpan={5} className="table-empty-row">暂无随想</td></tr>}
              {musings.map((m) => (
                <tr key={m.id} style={{ opacity: m.done ? 0.6 : 1 }}>
                  <td className="table-title">
                    <span style={{ textDecoration: m.done ? 'line-through' : 'none' }}>{m.content}</span>
                  </td>
                  <td><span className="table-category-chip">{m.type === 'idea' ? '💡 想法' : '✅ Todo'}</span></td>
                  <td>
                    <button className={`action-btn ${m.done ? 'toggle' : 'edit'}`} onClick={() => handleToggle(m.id)} title={m.done ? '标为未完成' : '标为完成'}>
                      <Check size={13} />
                    </button>
                  </td>
                  <td className="table-date">{format(new Date(m.createdAt), 'yyyy-MM-dd')}</td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(m)} title="编辑"><Pencil size={13} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(m.id)} title="删除"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminModal open={modalOpen} title={editing ? '编辑随想' : '新建随想'} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div className="editor-field">
          <label className="form-label">内容 *</label>
          <textarea rows={4} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="写下你的想法..." />
        </div>
        <div className="editor-field">
          <label className="form-label">类型</label>
          <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as 'idea' | 'todo' }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="idea">💡 想法</SelectItem>
              <SelectItem value="todo">✅ Todo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminModal>
    </div>
  );
};

export default MusingManagerPage;
