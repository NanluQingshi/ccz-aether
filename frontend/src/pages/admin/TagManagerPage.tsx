import React, { useEffect, useState } from 'react';
import { getTags, adminCreateTag, adminUpdateTag, adminDeleteTag } from '../../api/tags';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Tag, Plus, Trash2, Pencil } from 'lucide-react';
import type { TagVO } from '../../types/tag';

const TagManagerPage: React.FC = () => {
  const [tags, setTags] = useState<TagVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editTag, setEditTag] = useState<TagVO | null>(null);
  const [editName, setEditName] = useState('');
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getTags()
      .then((r) => setTags(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await adminCreateTag(newName.trim());
      setNewName('');
      addToast('标签已创建', 'success');
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '创建失败');
      if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const openEdit = (t: TagVO) => {
    setEditTag(t);
    setEditName(t.name);
    setEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editName.trim() || !editTag) return;
    setSaving(true);
    try {
      await adminUpdateTag(editTag.id, editName.trim());
      addToast('标签已更新', 'success');
      setEditModal(false);
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '更新失败');
      if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`确认删除标签「${name}」？关联此标签的文章不受影响。`)) return;
    try {
      await adminDeleteTag(id);
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
          <h1 className="admin-page-title">标签管理</h1>
          <span className="admin-page-count">共 {tags.length} 个</span>
        </div>
      </div>
      <div className="quick-add-bar">
        <Tag size={15} className="quick-add-icon" />
        <input
          className="quick-add-input"
          placeholder="新标签名称，回车添加"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          disabled={saving}
        />
        <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={saving || !newName.trim()}>
          <Plus size={13} /> 添加
        </button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="tag-chip-grid">
          {tags.length === 0 && <p className="empty-hint">暂无标签</p>}
          {tags.map((t) => (
            <div key={t.id} className="tag-manage-chip">
              <span className="tag-manage-name">{t.name}</span>
              <span className="tag-manage-slug">#{t.slug}</span>
              <button className="tag-manage-action" onClick={() => openEdit(t)} title="编辑">
                <Pencil size={11} />
              </button>
              <button className="tag-manage-delete" onClick={() => handleDelete(t.id, t.name)} title="删除">
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={editModal}
        title={`编辑标签「${editTag?.name}」`}
        onClose={() => setEditModal(false)}
        onSave={handleUpdate}
        saving={saving}
        saveLabel="更新"
      >
        <div className="editor-field">
          <label className="form-label">标签名称 *</label>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleUpdate(); }}
            placeholder="标签名称"
            autoFocus
          />
        </div>
      </AdminModal>
    </div>
  );
};

export default TagManagerPage;
