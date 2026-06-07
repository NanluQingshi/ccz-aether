import React, { useEffect, useState } from 'react';
import { getIssues, createIssue, updateIssue, updateIssueStatus, deleteIssue } from '../../api/issues';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Issue, IssueRequest } from '../../api/issues';
import type { IssueStatus, IssuePriority } from '../../constants/issueStatus';

const EMPTY: IssueRequest = { title: '', description: '', priority: 1 as IssuePriority };

const PRIORITY_MAP: Record<number, { label: string; color: string }> = {
  0: { label: '低', color: 'var(--color-text-muted)' },
  1: { label: '中', color: '#f97316' },
  2: { label: '高', color: 'var(--color-neon-pink)' },
};

const IssueManagerPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Issue | null>(null);
  const [form, setForm] = useState<IssueRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getIssues()
      .then((r) => setIssues(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (i: Issue) => {
    setEditing(i);
    setForm({ title: i.title, description: i.description ?? '', priority: i.priority });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { addToast('标题不能为空', 'error'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateIssue(editing.id, form);
        addToast('已更新', 'success');
      } else {
        await createIssue(form);
        addToast('已创建', 'success');
      }
      setModalOpen(false);
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败');
      if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id: number, status: IssueStatus) => {
    try {
      await updateIssueStatus(id, status);
      setIssues((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '状态更新失败');
      if (msg) addToast(msg, 'error');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!await showConfirm(`确认删除「${title}」？`)) return;
    try {
      await deleteIssue(id);
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
          <h1 className="admin-page-title">Issue 管理</h1>
          <span className="admin-page-count">共 {issues.length} 条</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <Plus size={14} /> 新建 Issue
        </button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>标题</th>
                <th>优先级</th>
                <th>状态</th>
                <th style={{ width: 90 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 && (
                <tr><td colSpan={4} className="table-empty-row">暂无 Issue</td></tr>
              )}
              {issues.map((i) => (
                <tr key={i.id}>
                  <td className="table-title">
                    <span className="table-title-link">{i.title}</span>
                    {i.description && <p className="table-summary">{i.description}</p>}
                  </td>
                  <td>
                    <span style={{ color: PRIORITY_MAP[i.priority].color, fontSize: '0.8rem', fontWeight: 600 }}>
                      {PRIORITY_MAP[i.priority].label}
                    </span>
                  </td>
                  <td>
                    <select
                      className="inline-status-select"
                      value={i.status}
                      onChange={(e) => handleStatusChange(i.id, Number(e.target.value) as IssueStatus)}
                    >
                      <option value={0}>Todo</option>
                      <option value={1}>进行中</option>
                      <option value={2}>已完成</option>
                    </select>
                  </td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(i)} title="编辑">
                      <Pencil size={13} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(i.id, i.title)} title="删除">
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
        title={editing ? '编辑 Issue' : '新建 Issue'}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      >
        <div className="editor-field">
          <label className="form-label">标题 *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Issue 标题"
          />
        </div>
        <div className="editor-field">
          <label className="form-label">描述</label>
          <textarea
            rows={3}
            value={form.description ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="可选"
          />
        </div>
        <div className="editor-field">
          <label className="form-label">优先级</label>
          <Select
            value={String(form.priority)}
            onValueChange={(v) => setForm((f) => ({ ...f, priority: Number(v) as IssuePriority }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0">低</SelectItem>
              <SelectItem value="1">中</SelectItem>
              <SelectItem value="2">高</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminModal>
    </div>
  );
};

export default IssueManagerPage;
