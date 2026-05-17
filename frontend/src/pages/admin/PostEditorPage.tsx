import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { adminCreatePost, adminUpdatePost, adminGetPosts } from '../../api/posts';
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
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [tags, setTags] = useState<TagVO[]>([]);
  const [categories, setCategories] = useState<CategoryVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    getTags().then((r) => setTags(r.data)).catch(() => {});
    getCategories().then((r) => setCategories(r.data)).catch(() => {});

    if (isEdit && id) {
      adminGetPosts(1, 999)
        .then((r) => {
          const post = r.data.records.find((p) => p.id === Number(id));
          if (post) {
            setTitle(post.title);
            setSlug(post.slug);
            setSummary(post.summary ?? '');
            setCoverImage(post.coverImage ?? '');
            setType(post.type ?? 'blog');
            setEventDate(post.eventDate ?? '');
            setCategoryId(post.category?.id ?? '');
            setSelectedTagIds(post.tags.map((t) => t.id));
          }
        })
        .catch(() => addToast('文章加载失败', 'error'))
        .finally(() => setInitialLoading(false));

    }
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
        categoryId: categoryId !== '' ? Number(categoryId) : undefined,
        tagIds: selectedTagIds,
        status: saveStatus,
      };
      if (isEdit && id) {
        await adminUpdatePost(Number(id), payload);
        addToast('已保存', 'success');
      } else {
        await adminCreatePost(payload);
        addToast('创建成功', 'success');
        navigate('/admin/posts');
      }
    } catch {
      addToast('保存失败', 'error');
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
            <MDEditor
              value={content}
              onChange={(v) => setContent(v ?? '')}
              height={520}
              preview="live"
              data-color-mode="light"
            />
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
            <Select value={String(categoryId)} onValueChange={(v) => setCategoryId(v === '' ? '' : Number(v))}>
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
