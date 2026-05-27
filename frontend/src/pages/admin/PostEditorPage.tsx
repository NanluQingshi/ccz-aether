import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminCreatePost, adminUpdatePost, adminGetPost } from '../../api/posts';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));
import { getErrorMessage } from '../../api/client';
import { getTags } from '../../api/tags';
import { getCategories } from '../../api/categories';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import type { TagVO } from '../../types/tag';
import type { CategoryVO } from '../../types/category';
import type { PostType } from '../../types/post';

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

  const [tags, setTags] = useState<TagVO[]>([]);
  const [categories, setCategories] = useState<CategoryVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const draftKey = `post-draft-${id ?? 'new'}`;
  const hasCheckedDraftRef = useRef(false);

  // Auto-save draft every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      if (!title && !content) return;
      localStorage.setItem(draftKey, JSON.stringify({
        title, slug, summary, content, coverImage, categoryId, selectedTagIds, type, eventDate,
      }));
    }, 30000);
    return () => clearInterval(timer);
  }, [title, slug, summary, content, coverImage, categoryId, selectedTagIds, type, eventDate, draftKey]);

  // Restore draft once after initial load
  useEffect(() => {
    if (initialLoading || hasCheckedDraftRef.current) return;
    hasCheckedDraftRef.current = true;
    const saved = localStorage.getItem(draftKey);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as Record<string, unknown>;
      if (window.confirm('检测到未保存的草稿，是否恢复？')) {
        if (draft.title !== undefined) setTitle(draft.title as string);
        if (draft.slug !== undefined) setSlug(draft.slug as string);
        if (draft.summary !== undefined) setSummary(draft.summary as string);
        if (draft.content !== undefined) setContent(draft.content as string);
        if (draft.coverImage !== undefined) setCoverImage(draft.coverImage as string);
        if (draft.categoryId !== undefined) setCategoryId(draft.categoryId as number | null);
        if (draft.selectedTagIds !== undefined) setSelectedTagIds(draft.selectedTagIds as number[]);
        if (draft.type !== undefined) setType(draft.type as PostType);
        if (draft.eventDate !== undefined) setEventDate(draft.eventDate as string);
      }
      localStorage.removeItem(draftKey);
    } catch { /* malformed draft, ignore */ }
  }, [initialLoading, draftKey]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getTags(), getCategories()])
      .then(([tagsRes, catsRes]) => {
        if (!cancelled) {
          setTags(tagsRes.data);
          setCategories(catsRes.data);
        }
      })
      .catch(() => {});

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
          setType((post.type as import('../../types/post').PostType) ?? 'blog');
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
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
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

  if (initialLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="admin-page editor-page">
      <div className="editor-header">
        <h1 className="admin-page-title">{isEdit ? '编辑文章' : '新建文章'}</h1>
        <div className="editor-actions">
          <button className="btn btn-secondary" onClick={() => handleSave(0)} disabled={loading}>
            存为草稿
          </button>
          <button className="btn btn-primary" onClick={() => handleSave(1)} disabled={loading}>
            发布文章
          </button>
        </div>
      </div>

      <div className="editor-body">
        <div className="editor-main">
          <input
            className="editor-title-input"
            placeholder="文章标题"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <div className="editor-md">
            <Suspense fallback={<div style={{ height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>编辑器加载中...</div>}>
              <MDEditor
                value={content}
                onChange={(v) => setContent(v ?? '')}
                height={520}
                preview="live"
                data-color-mode="dark"
              />
            </Suspense>
          </div>
        </div>

        <aside className="editor-sidebar">
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
                placeholder="yyyy-MM-dd"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                精确到月填 yyyy-MM-01，时间轴会自动省略日
              </span>
            </div>
          )}
          <div className="editor-field">
            <label className="form-label">Slug (URL)</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
          </div>
          <div className="editor-field">
            <label className="form-label">摘要</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="可选，留空则不显示摘要"
            />
          </div>
          <div className="editor-field">
            <label className="form-label">封面图 URL</label>
            <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
          </div>
          <div className="editor-field">
            <label className="form-label">分类</label>
            <Select value={String(categoryId ?? '')} onValueChange={(v) => setCategoryId(v === '' ? null : Number(v))}>
              <SelectTrigger><SelectValue placeholder="— 无分类 —" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">— 无分类 —</SelectItem>
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
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostEditorPage;
