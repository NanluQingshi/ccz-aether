import React, { useMemo, useState } from 'react';
import {
  getSites, createSite, updateSite, deleteSite,
  type Site, type SiteRequest,
} from '../api/sites';
import { getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { usePageData } from '../hooks/usePageData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Pencil, Trash2 } from 'lucide-react';

const EMPTY_FORM: SiteRequest = { name: '', url: '', category: '', sortOrder: 0 };

function getFaviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return '';
  }
}

function groupSites(sites: Site[]): { category: string; items: Site[] }[] {
  const map = new Map<string, Site[]>();
  for (const s of sites) {
    if (!map.has(s.category)) map.set(s.category, []);
    map.get(s.category)!.push(s);
  }
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
}

const SitesPage: React.FC = () => {
  const { token } = useAuthStore();
  const { addToast, showConfirm } = useUiStore();
  const isAdmin = !!token;

  const { data: sites, loading, setData: setSites, reload: load } = usePageData(getSites);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SiteRequest>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const groups = useMemo(() => groupSites(sites), [sites]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (site: Site) => {
    setEditingId(site.id);
    setForm({ name: site.name, url: site.url, category: site.category, sortOrder: site.sortOrder });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim() || !form.category.trim()) return;
    setSubmitting(true);
    try {
      if (editingId !== null) {
        await updateSite(editingId, form);
        addToast('已更新', 'success');
      } else {
        await createSite(form);
        addToast('已添加', 'success');
      }
      setShowForm(false);
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '操作失败');
      if (msg) addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!await showConfirm('确认删除这个网站？')) return;
    try {
      await deleteSite(id);
      setSites((prev) => prev.filter((s) => s.id !== id));
      addToast('已删除', 'success');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败');
      if (msg) addToast(msg, 'error');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container page-content">
      <div className="sites-header">
        <div>
          <h1 className="page-title">导航</h1>
          <p className="sites-subtitle">常用工具与优质资源收录</p>
        </div>
        {isAdmin && (
          <button className="btn btn-soft" onClick={openCreate}>+ 添加</button>
        )}
      </div>

      {sites.length === 0 && (
        <div className="empty-state">还没有收录任何网站</div>
      )}

      {groups.map((group) => (
        <div key={group.category} className="sites-group">
          <h2 className="sites-group-title">{group.category}</h2>
          <div className="sites-grid">
            {group.items.map((site) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="site-card"
              >
                <img
                  src={getFaviconUrl(site.url)}
                  alt=""
                  className="site-favicon"
                  width={16}
                  height={16}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="site-name">{site.name}</span>
                {isAdmin && (
                  <div className="site-card-admin" onClick={(e) => e.preventDefault()}>
                    <button className="issue-action-btn" onClick={() => openEdit(site)} title="编辑">
                      <Pencil size={11} />
                    </button>
                    <button className="issue-action-btn danger" onClick={() => handleDelete(site.id)} title="删除">
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      ))}

      {showForm && (
        <div className="issue-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="issue-modal-title">{editingId !== null ? '编辑网站' : '添加网站'}</h3>
            <form onSubmit={handleSubmit} className="issue-form">
              <div className="form-group">
                <label className="form-label">名称</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="网站名称"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">地址</label>
                <input
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://example.com"
                  type="url"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">分类</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="如：工具、学习、社区"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">排序值（越小越靠前）</label>
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

export default SitesPage;
