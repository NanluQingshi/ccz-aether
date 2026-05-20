import React, { useEffect, useMemo, useState } from 'react';
import {
  getRoadmapItems, createRoadmapItem, updateRoadmapItem, deleteRoadmapItem,
  type RoadmapItem, type RoadmapItemRequest,
} from '../api/roadmap';
import { getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/shadcn/Select';
import { Pencil, Trash2 } from 'lucide-react';

const PRIORITY_MAP: Record<string, { label: string; className: string }> = {
  high:   { label: '高', className: 'priority-high' },
  medium: { label: '中', className: 'priority-medium' },
  low:    { label: '低', className: 'priority-low' },
};


const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

const EMPTY_FORM: RoadmapItemRequest = {
  groupLabel: '', groupIcon: '', name: '', description: '',
  status: 'planned', priority: 'medium', sortOrder: 0,
};

function groupItems(items: RoadmapItem[]): { label: string; icon: string; items: RoadmapItem[] }[] {
  const map = new Map<string, { label: string; icon: string; items: RoadmapItem[] }>();
  for (const item of items) {
    if (!map.has(item.groupLabel)) {
      map.set(item.groupLabel, { label: item.groupLabel, icon: item.groupIcon ?? '', items: [] });
    }
    map.get(item.groupLabel)!.items.push(item);
  }
  return Array.from(map.values());
}

function sortItems(items: RoadmapItem[]): RoadmapItem[] {
  return [...items].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'done' ? -1 : 1;
    if (a.status === 'planned' && b.status === 'planned') {
      return (PRIORITY_ORDER[a.priority ?? 'low'] ?? 2) - (PRIORITY_ORDER[b.priority ?? 'low'] ?? 2);
    }
    return 0;
  });
}

const RoadmapPage: React.FC = () => {
  const { token } = useAuthStore();
  const { addToast, showConfirm } = useUiStore();
  const isAdmin = !!token;

  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<RoadmapItemRequest>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getRoadmapItems()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item: RoadmapItem) => {
    setEditingId(item.id);
    setForm({
      groupLabel: item.groupLabel,
      groupIcon: item.groupIcon ?? '',
      name: item.name,
      description: item.description ?? '',
      status: item.status,
      priority: item.priority ?? '',
      sortOrder: item.sortOrder,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.groupLabel.trim() || !form.name.trim()) return;
    setSubmitting(true);
    const payload: RoadmapItemRequest = {
      ...form,
      priority: form.status === 'done' ? undefined : (form.priority || undefined),
    };
    try {
      if (editingId !== null) {
        await updateRoadmapItem(editingId, payload);
        addToast('已更新', 'success');
      } else {
        await createRoadmapItem(payload);
        addToast('已创建', 'success');
      }
      setShowForm(false);
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '操作失败'); if (msg) addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!await showConfirm('确认删除这条 Roadmap 条目？')) return;
    try {
      await deleteRoadmapItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      addToast('已删除', 'success');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  const doneCount = useMemo(() => items.filter((i) => i.status === 'done').length, [items]);
  const totalCount = items.length;
  const percent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  const groups = useMemo(
    () => groupItems(items).map((g) => ({ ...g, sortedItems: sortItems(g.items) })),
    [items],
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container page-content">
      <div className="roadmap-header">
        <div className="roadmap-title-row">
          <h1 className="page-title">Roadmap</h1>
          <span className="roadmap-subtitle">功能规划与进展追踪</span>
        </div>
        <p className="roadmap-priority-note">
          优先级基于当前的开发想法与技术储备评估，仅供参考，会随实际情况动态调整。
        </p>
      </div>

      <div className="roadmap-progress-wrap">
        <div className="roadmap-progress-header">
          <span className="roadmap-progress-label">
            总进度 &nbsp;
            <span className="roadmap-progress-fraction">{doneCount} / {totalCount}</span>
          </span>
          <span className="roadmap-progress-percent">{percent}%</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAdmin && (
              <button className="btn btn-soft btn-sm" onClick={openCreate}>+ 新增条目</button>
            )}
          </div>
        </div>
        <div className="roadmap-progress-bar">
          <div className="roadmap-progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.label} className="roadmap-group">
          <h2 className="roadmap-group-title">
            <span className="roadmap-group-icon">{group.icon}</span>
            {group.label}
          </h2>
          <div className="roadmap-grid">
            {group.sortedItems.map((item) => (
              <div
                key={item.id}
                className={`roadmap-card ${item.status === 'done' ? 'roadmap-card-done' : 'roadmap-card-planned'}`}
              >
                <div className="roadmap-card-top">
                  <span className={`roadmap-status-icon ${item.status === 'done' ? 'icon-done' : 'icon-planned'}`}>
                    {item.status === 'done' ? '✓' : '○'}
                  </span>
                  {item.priority && item.status === 'planned' && (
                    <span className={`roadmap-priority ${PRIORITY_MAP[item.priority]?.className}`}>
                      {PRIORITY_MAP[item.priority]?.label}
                    </span>
                  )}
                  {isAdmin && (
                    <div className="roadmap-card-admin">
                      <button className="issue-action-btn" onClick={() => openEdit(item)} title="编辑"><Pencil size={13} /></button>
                      <button className="issue-action-btn danger" onClick={() => handleDelete(item.id)} title="删除"><Trash2 size={13} /></button>
                    </div>
                  )}
                </div>
                <h3 className="roadmap-card-name">{item.name}</h3>
                {item.description && <p className="roadmap-card-desc">{item.description}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {showForm && (
        <div className="issue-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="issue-modal-title">{editingId !== null ? '编辑条目' : '新增条目'}</h3>
            <form onSubmit={handleSubmit} className="issue-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">分组名称</label>
                  <input
                    value={form.groupLabel}
                    onChange={(e) => setForm((f) => ({ ...f, groupLabel: e.target.value }))}
                    placeholder="如：内容、功能、体验"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">图标</label>
                  <input
                    value={form.groupIcon}
                    onChange={(e) => setForm((f) => ({ ...f, groupIcon: e.target.value }))}
                    placeholder="◈"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">功能名称</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="简要描述功能"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">功能描述</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="可选"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">状态</label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as 'done' | 'planned' }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.status === 'planned' && (
                  <div className="form-group">
                    <label className="form-label">优先级</label>
                    <Select value={form.priority ?? ''} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as 'high' | 'medium' | 'low' }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">排序值（同组内越小越靠前）</label>
                <input
                  type="number"
                  value={form.sortOrder ?? 0}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                />
              </div>
              <div className="issue-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
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

export default RoadmapPage;
