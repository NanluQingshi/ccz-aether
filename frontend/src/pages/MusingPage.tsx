import React, { useEffect, useRef, useState } from 'react';
import {
  getMusings, createMusing, updateMusing, toggleMusingDone, deleteMusing,
  type Musing, type MusingRequest,
} from '../api/musings';
import { getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const TYPE_CONFIG = {
  idea: { label: '随想', cls: 'musing-type-idea' },
  todo: { label: 'Todo', cls: 'musing-type-todo' },
} as const;

function groupByMonth(musings: Musing[]): [string, Musing[]][] {
  const map = new Map<string, Musing[]>();
  for (const m of musings) {
    if (!m.createdAt) continue;
    const key = m.createdAt.slice(0, 7); // "YYYY-MM"
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return Array.from(map.entries());
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatMonth(ym: string) {
  const [y, m] = ym.split('-');
  return `${y} / ${m}`;
}

type FilterType = 'all' | 'idea' | 'todo';

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'all',  label: '全部' },
  { key: 'idea', label: '💭 随想' },
  { key: 'todo', label: '✓ Todo' },
];

const MusingPage: React.FC = () => {
  const { token } = useAuthStore();
  const { addToast, showConfirm } = useUiStore();
  const isAdmin = !!token;

  const [musings, setMusings] = useState<Musing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  // quick-input state
  const [inputVal, setInputVal] = useState('');
  const [inputType, setInputType] = useState<'idea' | 'todo'>('idea');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editVal, setEditVal] = useState('');
  const [editType, setEditType] = useState<'idea' | 'todo'>('idea');

  const load = () => {
    setLoading(true);
    getMusings()
      .then((r) => setMusings(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputVal.trim();
    if (!content) return;
    setSubmitting(true);
    try {
      const req: MusingRequest = { content, type: inputType };
      await createMusing(req);
      setInputVal('');
      load();
      inputRef.current?.focus();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '添加失败'); if (msg) addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (m: Musing) => {
    setEditingId(m.id);
    setEditVal(m.content);
    setEditType(m.type);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: number) => {
    const content = editVal.trim();
    if (!content) return;
    try {
      const res = await updateMusing(id, { content, type: editType });
      setMusings((prev) => prev.map((m) => m.id === id ? res.data : m));
      setEditingId(null);
      addToast('已更新', 'success');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '更新失败'); if (msg) addToast(msg, 'error');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await toggleMusingDone(id);
      setMusings((prev) => prev.map((m) => m.id === id ? res.data : m));
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '操作失败'); if (msg) addToast(msg, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!await showConfirm('确认删除这条随想？')) return;
    try {
      await deleteMusing(id);
      setMusings((prev) => prev.filter((m) => m.id !== id));
      addToast('已删除', 'success');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const filtered = filter === 'all' ? musings : musings.filter((m) => m.type === filter);
  // 同组内已完成的 todo 排到末尾
  const sorted = [...filtered].sort((a, b) => {
    if (a.done === b.done) return 0;
    return a.done ? 1 : -1;
  });
  const groups = groupByMonth(sorted);

  return (
    <div className="container page-content">
      {/* Header */}
      <div className="musing-header">
        <div>
          <h1 className="page-title">随想录</h1>
          <p className="musing-subtitle">随手记录灵感、念头与阶段计划，不设格式，想到就写</p>
        </div>
        <div className="musing-filter">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`musing-filter-btn ${filter === opt.key ? 'active' : ''} ${filter === opt.key && opt.key !== 'all' ? `musing-type-${opt.key}` : ''}`}
              onClick={() => setFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
          <span className="musing-count">{filtered.length} 条</span>
        </div>
      </div>

      {/* Quick input (admin only) */}
      {isAdmin && (
        <form className="musing-input-bar" onSubmit={handleAdd}>
          <div className="musing-type-toggle">
            {(['idea', 'todo'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`musing-type-btn ${inputType === t ? 'active' : ''} ${TYPE_CONFIG[t].cls}`}
                onClick={() => setInputType(t)}
              >
                {t === 'idea' ? '💭' : '✓'} {TYPE_CONFIG[t].label}
              </button>
            ))}
          </div>
          <input
            ref={inputRef}
            className="musing-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={inputType === 'idea' ? '随手记一个念头...' : '记一件待做的事...'}
            disabled={submitting}
            autoFocus
          />
          <button type="submit" className="btn btn-soft btn-sm" disabled={submitting || !inputVal.trim()}>
            {submitting ? '...' : '记下'}
          </button>
        </form>
      )}

      {/* Empty state */}
      {musings.length === 0 && (
        <div className="empty-state">还没有任何随想，{isAdmin ? '在上方输入框开始记录吧' : '敬请期待'}</div>
      )}

      {/* Timeline */}
      <div className="musing-timeline">
        {groups.map(([month, items]) => (
          <div key={month} className="musing-month-group">
            <div className="musing-month-label">{formatMonth(month)}</div>
            <div className="musing-month-items">
              {items.map((m) => (
                <div
                  key={m.id}
                  className={`musing-card ${m.type === 'todo' ? 'musing-card-todo' : 'musing-card-idea'} ${m.done ? 'musing-card-done' : ''}`}
                >
                  <div className="musing-card-dot" />

                  {editingId === m.id ? (
                    <div className="musing-edit-form">
                      <div className="musing-type-toggle musing-type-toggle-sm">
                        {(['idea', 'todo'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`musing-type-btn ${editType === t ? 'active' : ''} ${TYPE_CONFIG[t].cls}`}
                            onClick={() => setEditType(t)}
                          >
                            {TYPE_CONFIG[t].label}
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="musing-edit-input"
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        rows={3}
                        autoFocus
                      />
                      <div className="musing-edit-actions">
                        <button className="btn btn-secondary btn-sm" type="button" onClick={cancelEdit}>取消</button>
                        <button className="btn btn-primary btn-sm" type="button" onClick={() => saveEdit(m.id)}>保存</button>
                      </div>
                    </div>
                  ) : (
                    <div className="musing-card-inner">
                      <div className="musing-card-header">
                        <div className="musing-card-meta">
                          <span className={`musing-type-tag ${TYPE_CONFIG[m.type].cls}`}>
                            {m.type === 'idea' ? '💭' : '✓'} {TYPE_CONFIG[m.type].label}
                          </span>
                          <span className="musing-date">{formatDate(m.createdAt)}</span>
                        </div>
                        {isAdmin && (
                          <div className="musing-card-actions">
                            {m.type === 'todo' && (
                              <button
                                className={`musing-action-btn ${m.done ? 'musing-action-reopen' : 'musing-action-done'}`}
                                onClick={() => handleToggle(m.id)}
                                title={m.done ? '重新打开' : '标为完成'}
                              >
                                {m.done ? '↩' : '✓'}
                              </button>
                            )}
                            <button className="musing-action-btn" onClick={() => startEdit(m)}>编辑</button>
                            <button className="musing-action-btn danger" onClick={() => handleDelete(m.id)}>删除</button>
                          </div>
                        )}
                      </div>
                      <p className="musing-content">{m.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusingPage;
