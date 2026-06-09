import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { adminCreatePost, adminUpdatePost, adminGetPost } from '../../api/posts';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));
import { getErrorMessage } from '../../api/client';
import { useMetaStore } from '../../store/metaStore';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { ChevronRight, RotateCcw, X, Clock } from 'lucide-react';
import type { PostType } from '../../types/post';

/* ── Auto-save status ── */
type SaveStatus = 'idle' | 'saving' | 'saved';

const SaveIndicator: React.FC<{ status: SaveStatus; savedAt: string | null }> = ({ status, savedAt }) => {
  if (status === 'saving') {
    return <span className="autosave-indicator saving"><span className="autosave-spinner" /> 自动保存中...</span>;
  }
  if (status === 'saved' && savedAt) {
    return <span className="autosave-indicator saved"><Clock size={12} /> 自动保存于 {savedAt}</span>;
  }
  return null;
};

/* ── Draft recovery banner ── */
const DraftBanner: React.FC<{ onRestore: () => void; onDismiss: () => void }> = ({ onRestore, onDismiss }) => (
  <div className="draft-banner" role="alert">
    <span className="draft-banner-text">
      <RotateCcw size={14} /> 检测到上次未保存的草稿，是否恢复？
    </span>
    <div className="draft-banner-actions">
      <button className="btn btn-sm btn-primary" onClick={onRestore}>恢复草稿</button>
      <button className="btn btn-sm btn-ghost" onClick={onDismiss}>
        <X size={13} /> 忽略
      </button>
    </div>
  </div>
);

const PostEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { addToast } = useUiStore();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [type, setType] = useState<PostType>('blog');
  const [eventDate, setEventDate] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const { tags, categories, load: loadMeta } = useMetaStore();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [draftBanner, setDraftBanner] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<Record<string, unknown> | null>(null);

  const draftKey = `post-draft-${id ?? 'new'}`;
  const hasCheckedDraftRef = useRef(false);

  /* Auto-save every 30s */
  useEffect(() => {
    const timer = setInterval(() => {
      if (!title && !content) return;
      setSaveStatus('saving');
      localStorage.setItem(draftKey, JSON.stringify({
        title, slug, summary, content, coverImage, categoryId, selectedTagIds, type, eventDate,
      }));
      setTimeout(() => {
        setSaveStatus('saved');
        setSavedAt(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
      }, 400);
    }, 30000);
    return () => clearInterval(timer);
  }, [title, slug, summary, content, coverImage, categoryId, selectedTagIds, type, eventDate, draftKey]);

  /* Check for saved draft once */
  useEffect(() => {
    if (initialLoading || hasCheckedDraftRef.current) return;
    hasCheckedDraftRef.current = true;
    const saved = localStorage.getItem(draftKey);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as Record<string, unknown>;
      setPendingDraft(draft);
      setDraftBanner(true);
    } catch { /* malformed, ignore */ }
  }, [initialLoading, draftKey]);

  const applyDraft = (draft: Record<string, unknown>) => {
    if (draft.title !== undefined) setTitle(draft.title as string);
    if (draft.slug !== undefined) setSlug(draft.slug as string);
    if (draft.summary !== undefined) setSummary(draft.summary as string);
    if (draft.content !== undefined) setContent(draft.content as string);
    if (draft.coverImage !== undefined) setCoverImage(draft.coverImage as string);
    if (draft.categoryId !== undefined) setCategoryId(draft.categoryId as number | null);
    if (draft.selectedTagIds !== undefined) setSelectedTagIds(draft.selectedTagIds as number[]);
    if (draft.type !== undefined) setType(draft.type as PostType);
    if (draft.eventDate !== undefined) setEventDate(draft.eventDate as string);
    localStorage.removeItem(draftKey);
  };

  const handleRestoreDraft = () => {
    if (pendingDraft) applyDraft(pendingDraft);
    setDraftBanner(false);
    setPendingDraft(null);
  };

  const handleDismissDraft = () => {
    localStorage.removeItem(draftKey);
    setDraftBanner(false);
    setPendingDraft(null);
  };

  /* Load tags, categories (from cache), and post data */
  useEffect(() => {
    let cancelled = false;
    loadMeta(); // 从 metaStore 缓存加载，多次打开编辑器不重复请求

    if (isEdit && id) {
      adminGetPost(Number(id))
        .then((r) => {
          if (cancelled) return;
          const post = r.data;
          setTitle(post.title);
          setSlug(post.slug);
          setSummary(post.summary ?? '');
          setContent(post.content ?? '');
          setCoverImage(post.coverImage ?? '');
          setType((post.type as PostType) ?? 'blog');
          setEventDate(post.eventDate ? String(post.eventDate) : '');
          setCategoryId(post.category?.id ?? null);
          setSelectedTagIds(post.tags.map((t) => t.id));
        })
        .catch(() => { if (!cancelled) addToast('文章加载失败', 'error'); })
        .finally(() => { if (!cancelled) setInitialLoading(false); });
    }

    return () => { cancelled = true; };
  }, [id, isEdit]);

  const toSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!isEdit) setSlug(toSlug(v));
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((i) => i !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async (saveStatus: number) => {
    if (!title.trim() || !content.trim()) {
      addToast('标题和内容不能为空', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title,
        slug: slug || toSlug(title),
        summary,
        content,
        coverImage: coverImage || undefined,
        type,
        eventDate: type === 'ai_timeline' && eventDate ? eventDate : undefined,
        categoryId: categoryId !== null ? categoryId : undefined,
        tagIds: selectedTagIds,
        status: saveStatus,
      };
      if (isEdit && id) {
        await adminUpdatePost(Number(id), payload);
        localStorage.removeItem(draftKey);
        addToast('已保存', 'success');
      } else {
        await adminCreatePost(payload);
        localStorage.removeItem(draftKey);
        addToast('创建成功', 'success');
        navigate('/admin/posts');
      }
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  /* Word count */
  const charCount = content.length;
  const wordCount = content.replace(/\s+/g, '').length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 300));

  if (initialLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="admin-page editor-page">
      {/* Header */}
      <div className="editor-header">
        <div className="editor-breadcrumb">
          <Link to="/admin/posts" className="breadcrumb-link">文章管理</Link>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span className="breadcrumb-current">{isEdit ? '编辑文章' : '新建文章'}</span>
          <SaveIndicator status={saveStatus} savedAt={savedAt} />
        </div>
        <div className="editor-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => handleSave(0)} disabled={loading}>
            存为草稿
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => handleSave(1)} disabled={loading}>
            {loading ? '保存中...' : '发布文章'}
          </button>
        </div>
      </div>

      {/* Draft recovery banner */}
      {draftBanner && (
        <DraftBanner onRestore={handleRestoreDraft} onDismiss={handleDismissDraft} />
      )}

      <div className="editor-body">
        {/* Main edit area */}
        <div className="editor-main">
          <input
            className="editor-title-input"
            placeholder="文章标题"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <div className="editor-md">
            <Suspense fallback={
              <div className="editor-loading-placeholder">编辑器加载中...</div>
            }>
              <MDEditor
                value={content}
                onChange={(v) => setContent(v ?? '')}
                height={520}
                preview="live"
                data-color-mode="dark"
              />
            </Suspense>
          </div>
          <div className="editor-meta-bar">
            <span>{charCount} 字符</span>
            <span className="editor-meta-sep">·</span>
            <span>{wordCount} 字（去空格）</span>
            <span className="editor-meta-sep">·</span>
            <span>预计阅读 {readMinutes} 分钟</span>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="editor-sidebar">
          {/* Group: 基本信息 */}
          <div className="sidebar-group">
            <div className="sidebar-group-title">基本信息</div>

            <div className="editor-field">
              <label className="form-label">文章类型</label>
              <Select value={type} onValueChange={(v) => setType(v as PostType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">普通博客</SelectItem>
                  <SelectItem value="ai_timeline">AI 大事纪</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'ai_timeline' && (
              <div className="editor-field">
                <label className="form-label">事件日期</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
                <span className="field-hint">精确到月填 yyyy-MM-01</span>
              </div>
            )}

            <div className="editor-field">
              <label className="form-label">Slug (URL)</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated"
              />
            </div>

            <div className="editor-field">
              <label className="form-label">摘要</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="可选，留空则不显示"
              />
            </div>
          </div>

          {/* Group: 分类与标签 */}
          <div className="sidebar-group">
            <div className="sidebar-group-title">分类与标签</div>

            <div className="editor-field">
              <label className="form-label">分类</label>
              <Select
                value={categoryId !== null ? String(categoryId) : 'none'}
                onValueChange={(v) => setCategoryId(v === 'none' ? null : Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="— 无分类 —" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— 无分类 —</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="editor-field">
              <label className="form-label">标签（可多选）</label>
              <div className="tag-selector">
                {tags.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`tag-select-chip ${selectedTagIds.includes(t.id) ? 'selected' : ''}`}
                    onClick={() => toggleTag(t.id)}
                  >
                    {t.name}
                  </button>
                ))}
                {tags.length === 0 && <span className="field-hint">暂无标签</span>}
              </div>
            </div>
          </div>

          {/* Group: 高级选项 */}
          <div className="sidebar-group">
            <div className="sidebar-group-title">高级选项</div>
            <div className="editor-field">
              <label className="form-label">封面图 URL</label>
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostEditorPage;
