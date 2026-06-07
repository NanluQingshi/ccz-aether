import React, { useEffect, useState } from 'react';
import { getSites, createSite, updateSite, deleteSite } from '../../api/sites';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import type { Site, SiteRequest } from '../../api/sites';

const EMPTY: SiteRequest = { name: '', url: '', category: '', sortOrder: 0 };

const SiteManagerPage: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Site | null>(null);
  const [form, setForm] = useState<SiteRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getSites()
      .then((r) => setSites(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (s: Site) => {
    setEditing(s);
    setForm({ name: s.name, url: s.url, category: s.category, sortOrder: s.sortOrder ?? 0 });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.url.trim()) { addToast('名称和 URL 不能为空', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await updateSite(editing.id, form); addToast('已更新', 'success'); }
      else { await createSite(form); addToast('已添加', 'success'); }
      setModalOpen(false); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`确认删除「${name}」？`)) return;
    try { await deleteSite(id); addToast('已删除', 'success'); load(); }
    catch (e: unknown) { const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error'); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">网站导航管理</h1>
          <span className="admin-page-count">共 {sites.length} 个</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={14} /> 添加网站</button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>名称</th><th>URL</th><th>分类</th><th>排序</th><th style={{ width: 90 }}>操作</th></tr>
            </thead>
            <tbody>
              {sites.length === 0 && <tr><td colSpan={5} className="table-empty-row">暂无网站</td></tr>}
              {sites.map((s) => (
                <tr key={s.id}>
                  <td className="table-title"><span className="table-title-link">{s.name}</span></td>
                  <td>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: 'var(--color-neon-cyan)',
                        fontSize: '0.8rem',
                        maxWidth: 260,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {s.url} <ExternalLink size={11} style={{ flexShrink: 0 }} />
                    </a>
                  </td>
                  <td><span className="table-category-chip">{s.category || '—'}</span></td>
                  <td className="table-views">{s.sortOrder}</td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(s)} title="编辑"><Pencil size={13} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(s.id, s.name)} title="删除"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminModal open={modalOpen} title={editing ? '编辑网站' : '添加网站'} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div className="editor-field">
          <label className="form-label">名称 *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="GitHub" />
        </div>
        <div className="editor-field">
          <label className="form-label">URL *</label>
          <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://github.com" />
        </div>
        <div className="editor-field">
          <label className="form-label">分类</label>
          <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="开发工具/参考资料/..." />
        </div>
        <div className="editor-field">
          <label className="form-label">排序（数字越小越靠前）</label>
          <input type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
        </div>
      </AdminModal>
    </div>
  );
};

export default SiteManagerPage;
