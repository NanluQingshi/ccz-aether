import React, { useState } from 'react';
import {
  getIssues, createIssue, updateIssue, updateIssueStatus, deleteIssue,
  type Issue, type IssueRequest,
} from '../api/issues';
import { getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { usePageData } from '../hooks/usePageData';
import { useCRUDPage } from '../hooks/useCRUDPage';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/shadcn/Select';
import { ArrowDown, ArrowRight, ArrowUp, Pencil, Trash2 } from 'lucide-react';

const STATUS_COLS: { key: 0 | 1 | 2; label: string; color: string }[] = [
  { key: 0, label: 'Todo',        color: 'issue-col-todo' },
  { key: 1, label: 'In Progress', color: 'issue-col-progress' },
  { key: 2, label: 'Done',        color: 'issue-col-done' },
];

const PRIORITY_LABELS: Record<number, { label: string; cls: string; icon: React.ReactNode }> = {
  0: { label: '低',  cls: 'issue-priority-low',    icon: <ArrowDown  size={11} /> },
  1: { label: '中',  cls: 'issue-priority-medium', icon: <ArrowRight size={11} /> },
  2: { label: '高',  cls: 'issue-priority-high',   icon: <ArrowUp    size={11} /> },
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
  const isAdmin = !!token;

  const { data: issues, loading, setData: setIssues, reload: load } = usePageData(getIssues);
  const {
    showForm, editingId, form, submitting,
    setForm, openCreate, openEdit, closeForm,
    handleSubmit, handleDelete, addToast,
  } = useCRUDPage<Issue, FormState>({
    emptyForm: EMPTY_FORM,
    toForm: (issue) => ({
      title: issue.title,
      description: issue.description ?? '',
      priority: issue.priority,
    }),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await handleSubmit(async () => {
      const payload: IssueRequest = { title: form.title, description: form.description, priority: form.priority };
      if (editingId !== null) {
        await updateIssue(editingId, payload);
        addToast('已更新', 'success');
      } else {
        await createIssue(payload);
        addToast('已创建', 'success');
      }
      closeForm();
      load();
    });
  };

  const onDelete = (id: number) => handleDelete(
    id, deleteIssue,
    () => setIssues((prev) => prev.filter((i) => i.id !== id)),
    '确认删除这条 Issue？',
  );

  const handleStatusChange = async (id: number, status: 0 | 1 | 2) => {
    try {
      await updateIssueStatus(id, status);
      setIssues((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '更新失败'); if (msg) addToast(msg, 'error');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container page-content page-content--board">
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
          const colIssues = issues
            .filter((i) => i.status === col.key)
            .sort((a, b) => b.priority - a.priority || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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
                        {PRIORITY_LABELS[issue.priority].icon}
                        {PRIORITY_LABELS[issue.priority].label}
                      </span>
                      {isAdmin && (
                        <div className="issue-card-actions">
                          <button className="issue-action-btn" onClick={() => openEdit(issue)} title="编辑"><Pencil size={13} /></button>
                          <button className="issue-action-btn danger" onClick={() => onDelete(issue.id)} title="删除"><Trash2 size={13} /></button>
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
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{editingId !== null ? '编辑 Issue' : '新建 Issue'}</h3>
            <form onSubmit={onSubmit} className="modal-form">
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
                <Select value={String(form.priority)} onValueChange={(v) => setForm((f) => ({ ...f, priority: Number(v) as 0 | 1 | 2 }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">低</SelectItem>
                    <SelectItem value="1">中</SelectItem>
                    <SelectItem value="2">高</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="modal-form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeForm}>取消</button>
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
