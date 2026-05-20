import React, { useEffect, useMemo, useState } from 'react';
import {
  getPractices, createPractice, updatePractice, deletePractice,
  type Practice, type PracticeLink, type PracticeRequest,
} from '../api/practice';
import { getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/shadcn/Select';
import { ExternalLink, Pencil, Trash2, X } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  todo:        { label: '待学习', className: 'status-todo' },
  in_progress: { label: '学习中', className: 'status-in-progress' },
  mastered:    { label: '已掌握', className: 'status-mastered' },
};

type FilterStatus = 'all' | 'todo' | 'in_progress' | 'mastered';

const FILTER_OPTIONS: { key: FilterStatus; label: string }[] = [
  { key: 'all',         label: '全部' },
  { key: 'todo',        label: '待学习' },
  { key: 'in_progress', label: '学习中' },
  { key: 'mastered',    label: '已掌握' },
];

const EMPTY_FORM: PracticeRequest = {
  category: '', categoryIcon: '', name: '', description: '',
  links: [], status: 'todo', sortOrder: 0,
};

function groupItems(items: Practice[]): { category: string; icon: string; items: Practice[] }[] {
  const map = new Map<string, { category: string; icon: string; items: Practice[] }>();
  for (const item of items) {
    if (!map.has(item.category)) {
      map.set(item.category, { category: item.category, icon: item.categoryIcon ?? '', items: [] });
    }
    map.get(item.category)!.items.push(item);
  }
  return Array.from(map.values());
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = STATUS_MAP[status] ?? STATUS_MAP.todo;
  return <span className={`practice-status-badge ${config.className}`}>{config.label}</span>;
};

const PracticePage: React.FC = () => {
  const { token } = useAuthStore();
  const { addToast, showConfirm } = useUiStore();
  const isAdmin = !!token;

  const [items, setItems] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PracticeRequest>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getPractices()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item: Practice) => {
    setEditingId(item.id);
    setForm({
      category: item.category,
      categoryIcon: item.categoryIcon ?? '',
      name: item.name,
      description: item.description ?? '',
      links: item.links ?? [],
      status: item.status,
      sortOrder: item.sortOrder,
    });
    setShowForm(true);
  };

  const addLink = () =>
    setForm((f) => ({ ...f, links: [...f.links, { title: '', url: '' }] }));

  const removeLink = (idx: number) =>
    setForm((f) => ({ ...f, links: f.links.filter((_, i) => i !== idx) }));

  const updateLink = (idx: number, field: keyof PracticeLink, value: string) =>
    setForm((f) => ({
      ...f,
      links: f.links.map((l, i) => (i === idx ? { ...l, [field]: value } : l)),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category.trim() || !form.name.trim()) return;
    setSubmitting(true);
    try {
      if (editingId !== null) {
        await updatePractice(editingId, form);
        addToast('已更新', 'success');
      } else {
        await createPractice(form);
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
    if (!await showConfirm('确认删除这条记录？')) return;
    try {
      await deletePractice(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      addToast('已删除', 'success');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  const filtered = useMemo(
    () => filter === 'all' ? items : items.filter((i) => i.status === filter),
    [filter, items],
  );
  const groups = useMemo(() => groupItems(filtered), [filtered]);
  const inProgressCount = useMemo(() => items.filter((i) => i.status === 'in_progress').length, [items]);
  const masteredCount = useMemo(() => items.filter((i) => i.status === 'mastered').length, [items]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container page-content">
      <div className="practice-header">
        <div className="practice-title-row">
          <h1 className="page-title">修炼手册</h1>
          <span className="practice-subtitle">学习路线与进度追踪</span>
        </div>
        <p className="practice-desc">
          共 {items.length} 项 · {inProgressCount} 项学习中 · {masteredCount} 项已掌握
        </p>
      </div>

      <div className="practice-filter-bar">
        <div className="practice-filter-chips">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`filter-chip ${filter === opt.key ? 'active' : ''}`}
              onClick={() => setFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {isAdmin && (
          <button className="btn btn-soft btn-sm" onClick={openCreate}>+ 新增条目</button>
        )}
      </div>

      {items.length === 0 && (
        <div className="empty-state">还没有任何记录，{isAdmin ? '点击新增条目开始吧' : '敬请期待'}</div>
      )}

      {groups.map((group) => (
        <div key={group.category} className="practice-group">
          <h2 className="practice-group-title">
            <span className="practice-group-icon">{group.icon}</span>
            {group.category}
          </h2>
          <div className="practice-grid">
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`practice-card practice-card-${item.status}`}
              >
                <div className="practice-card-top">
                  <StatusBadge status={item.status} />
                  {isAdmin && (
                    <div className="practice-card-admin">
                      <button className="issue-action-btn" onClick={() => openEdit(item)} title="编辑">
                        <Pencil size={13} />
                      </button>
                      <button className="issue-action-btn danger" onClick={() => handleDelete(item.id)} title="删除">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="practice-card-name">{item.name}</h3>
                {item.description && <p className="practice-card-desc">{item.description}</p>}
                {item.links && item.links.length > 0 && (
                  <div className="practice-card-links">
                    {item.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="practice-link-chip"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={10} />
                        {link.title || link.url}
                      </a>
                    ))}
                  </div>
                )}
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
                  <label className="form-label">分类名称</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="如：编程语言、后端框架"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">图标</label>
                  <input
                    value={form.categoryIcon}
                    onChange={(e) => setForm((f) => ({ ...f, categoryIcon: e.target.value }))}
                    placeholder="◈"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">知识点名称</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="如：Kubernetes、系统设计"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">学习目标 / 备注</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="可选，记录想学到什么程度或相关资料"
                />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>关联链接</label>
                  <button type="button" className="btn btn-soft btn-sm" onClick={addLink}>+ 添加</button>
                </div>
                {form.links.map((link, idx) => (
                  <div key={idx} className="practice-link-row">
                    <input
                      value={link.title}
                      onChange={(e) => updateLink(idx, 'title', e.target.value)}
                      placeholder="标题"
                      style={{ flex: '0 0 110px' }}
                    />
                    <input
                      value={link.url}
                      onChange={(e) => updateLink(idx, 'url', e.target.value)}
                      placeholder="URL"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="issue-action-btn danger" onClick={() => removeLink(idx)}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">学习状态</label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as PracticeRequest['status'] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">待学习</SelectItem>
                      <SelectItem value="in_progress">学习中</SelectItem>
                      <SelectItem value="mastered">已掌握</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="form-label">排序值（越小越靠前）</label>
                  <input
                    type="number"
                    value={form.sortOrder ?? 0}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                  />
                </div>
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

export default PracticePage;
