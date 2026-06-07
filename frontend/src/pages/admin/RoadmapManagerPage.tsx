import React, { useEffect, useState } from 'react';
import { getRoadmapItems, createRoadmapItem, updateRoadmapItem, deleteRoadmapItem } from '../../api/roadmap';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { RoadmapItem, RoadmapItemRequest } from '../../api/roadmap';
import type { RoadmapStatus, RoadmapPriority } from '../../constants/roadmapStatus';

const EMPTY: RoadmapItemRequest = { groupLabel: '', name: '', status: 'planned', priority: 'medium', sortOrder: 0 };
const STATUS_COLOR: Record<string, string> = { done: '#22c55e', planned: 'var(--color-neon-cyan)' };
const PRIORITY_COLOR: Record<string, string> = {
  low: 'var(--color-text-muted)',
  medium: '#f97316',
  high: 'var(--color-neon-pink)',
};
const PRIORITY_LABEL: Record<string, string> = { low: '低', medium: '中', high: '高' };

const RoadmapManagerPage: React.FC = () => {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoadmapItem | null>(null);
  const [form, setForm] = useState<RoadmapItemRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getRoadmapItems()
      .then((r) => setItems(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (item: RoadmapItem) => {
    setEditing(item);
    setForm({
      groupLabel: item.groupLabel,
      groupIcon: item.groupIcon ?? '',
      name: item.name,
      description: item.description ?? '',
      status: item.status,
      priority: item.priority,
      sortOrder: item.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.groupLabel.trim() || !form.name.trim()) { addToast('分组和名称不能为空', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await updateRoadmapItem(editing.id, form); addToast('已更新', 'success'); }
      else { await createRoadmapItem(form); addToast('已创建', 'success'); }
      setModalOpen(false); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`确认删除「${name}」？`)) return;
    try { await deleteRoadmapItem(id); addToast('已删除', 'success'); load(); }
    catch (e: unknown) { const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error'); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">Roadmap 管理</h1>
          <span className="admin-page-count">共 {items.length} 条</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={14} /> 新增功能</button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>分组</th><th>功能名称</th><th>状态</th><th>优先级</th><th style={{ width: 90 }}>操作</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={5} className="table-empty-row">暂无条目</td></tr>}
              {items.map((item) => (
                <tr key={item.id}>
                  <td><span className="table-category-chip">{item.groupIcon} {item.groupLabel}</span></td>
                  <td className="table-title">
                    <span className="table-title-link">{item.name}</span>
                    {item.description && <p className="table-summary">{item.description}</p>}
                  </td>
                  <td>
                    <span style={{ color: STATUS_COLOR[item.status], fontSize: '0.8rem', fontWeight: 600 }}>
                      {item.status === 'done' ? '已完成' : '规划中'}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: item.priority ? PRIORITY_COLOR[item.priority] : 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                      {item.priority ? PRIORITY_LABEL[item.priority] : '—'}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(item)} title="编辑"><Pencil size={13} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(item.id, item.name)} title="删除"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminModal open={modalOpen} title={editing ? '编辑功能' : '新增功能'} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="editor-field">
            <label className="form-label">分组名称 *</label>
            <input value={form.groupLabel} onChange={(e) => setForm((f) => ({ ...f, groupLabel: e.target.value }))} placeholder="核心功能" />
          </div>
          <div className="editor-field">
            <label className="form-label">分组图标（emoji）</label>
            <input value={form.groupIcon ?? ''} onChange={(e) => setForm((f) => ({ ...f, groupIcon: e.target.value }))} placeholder="🚀" />
          </div>
        </div>
        <div className="editor-field">
          <label className="form-label">功能名称 *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="功能名称" />
        </div>
        <div className="editor-field">
          <label className="form-label">描述</label>
          <textarea rows={2} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="可选" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="editor-field">
            <label className="form-label">状态</label>
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as RoadmapStatus }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">规划中</SelectItem>
                <SelectItem value="done">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="editor-field">
            <label className="form-label">优先级</label>
            <Select value={form.priority ?? 'medium'} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as RoadmapPriority }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="high">高</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default RoadmapManagerPage;
