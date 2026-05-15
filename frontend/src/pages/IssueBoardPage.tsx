import React, { useEffect, useState } from 'react';
import {
  getIssues, createIssue, updateIssue, updateIssueStatus, deleteIssue,
  type Issue, type IssueRequest,
} from '../api/issues';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const STATUS_COLS: { key: 0 | 1 | 2; label: string; color: string }[] = [
  { key: 0, label: 'Todo',        color: 'issue-col-todo' },
  { key: 1, label: 'In Progress', color: 'issue-col-progress' },
  { key: 2, label: 'Done',        color: 'issue-col-done' },
];

const PRIORITY_LABELS: Record<number, { label: string; cls: string }> = {
  0: { label: '低',  cls: 'issue-priority-low' },
  1: { label: '中',  cls: 'issue-priority-medium' },
  2: { label: '高',  cls: 'issue-priority-high' },
};

const NEXT_STATUS: Record<number, { status: 0 | 1 | 2; label: string }[]> = {
  0: [{ status: 1, label: '开始处理' }],
  1: [{ status: 0, label: '退回 Todo' }, { status: 2, label: '标为完成' }],
  2: [{ status: 1, label: '重新处理' }],
};

interface FormState { title: string; description: string; priority: 0 | 1 | 2 }
const EMPTY_FORM: FormState = { title: '', description: '', priority: 1 };

const IssueBoardPage: React.FC = () => {
  const { token } = useAuthStore();
  const { addToast } = useUiStore();
  const isAdmin = !!token;

  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getIssues()
      .then((r) => setIssues(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (issue: Issue) => {
    setEditingId(issue.id);
    setForm({ title: issue.title, description: issue.description ?? '', priority: issue.priority });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const payload: IssueRequest = { title: form.title, description: form.description, priority: form.priority };
      if (editingId !== null) {
        await updateIssue(editingId, payload);
        addToast('已更新', 'success');
      } else {
        await createIssue(payload);
        addToast('已创建', 'success');
      }
      setShowForm(false);
      load();
    } catch {
      addToast('操作失败', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, status: 0 | 1 | 2) => {
    try {
      await updateIssueStatus(id, status);
      setIssues((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    } catch {
      addToast('更新失败', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除？')) return;
    try {
      await deleteIssue(id);
      setIssues((prev) => prev.filter((i) => i.id !== id));
      addToast('已删除', 'success');
    } catch {
      addToast('删除失败', 'error');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container page-content">
      <div className="issue-header">
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>Issue Bin</h1>
          <p className="issue-subtitle">记录网站待处理的问题与优化项</p>
        </div>
        {isAdmin && (
          <button className="btn btn-soft" onClick={openCreate}>+ 新建</button>
        )}
      </div>

      {/* 看板 */}
      <div className="issue-board">
        {STATUS_COLS.map((col) => {
          const colIssues = issues.filter((i) => i.status === col.key);
          return (
            <div key={col.key} className={`issue-col ${col.color}`}>
              <div className="issue-col-header">
                <span className="issue-col-title">{col.label}</span>
                <span className="issue-col-count">{colIssues.length}</span>
              </div>
              <div className="issue-col-body">
                {colIssues.length === 0 && (
                  <div className="issue-empty">暂无</div>
                )}
                {colIssues.map((issue) => (
                  <div key={issue.id} className="issue-card">
                    <div className="issue-card-top">
                      <span className={`issue-priority ${PRIORITY_LABELS[issue.priority].cls}`}>
                        {PRIORITY_LABELS[issue.priority].label}
                      </span>
                      {isAdmin && (
                        <div className="issue-card-actions">
                          <button className="issue-action-btn" onClick={() => openEdit(issue)}>编辑</button>
                          <button className="issue-action-btn danger" onClick={() => handleDelete(issue.id)}>删除</button>
                        </div>
                      )}
                    </div>
                    <p className="issue-card-title">{issue.title}</p>
                    {issue.description && (
                      <p className="issue-card-desc">{issue.description}</p>
                    )}
                    {isAdmin && (
                      <div className="issue-status-btns">
                        {NEXT_STATUS[issue.status].map((next) => (
                          <button
                            key={next.status}
                            className="issue-status-btn"
                            onClick={() => handleStatusChange(issue.id, next.status)}
                          >
                            {next.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 新建/编辑弹窗 */}
      {showForm && (
        <div className="issue-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="issue-modal-title">{editingId !== null ? '编辑 Issue' : '新建 Issue'}</h3>
            <form onSubmit={handleSubmit} className="issue-form">
              <div className="form-group">
                <label className="form-label">标题</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="简要描述问题"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">详细描述</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="可选"
                />
              </div>
              <div className="form-group">
                <label className="form-label">优先级</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) as 0 | 1 | 2 }))}
                >
                  <option value={0}>低</option>
                  <option value={1}>中</option>
                  <option value={2}>高</option>
                </select>
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

export default IssueBoardPage;
