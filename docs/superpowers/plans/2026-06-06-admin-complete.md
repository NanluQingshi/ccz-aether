# 管理后台功能补全 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为管理后台补全标签/分类/书籍/Issue/随想/修炼/Roadmap/网站导航 8 个管理页面，并修复后端 7 个模块未明确要求 ADMIN 角色的安全配置。

**架构：** 所有新管理页面统一放在 `frontend/src/pages/admin/`，共用一个 `AdminModal` 可复用弹窗组件处理创建/编辑表单。后端只需修改 `SecurityConfig.java` 一个文件，为 7 个模块的写操作显式加上 `hasRole("ADMIN")` 规则。

**技术栈：** React 18 + TypeScript，Spring Boot 3，JWT，Radix UI（已有 Select/shadcn 组件），Lucide React 图标，现有 CSS 变量体系（`components.css`）。

---

## 文件结构

### 新建文件
| 文件 | 职责 |
|------|------|
| `frontend/src/components/ui/AdminModal.tsx` | 可复用弹窗：标题 + 内容 + 保存/取消按钮 |
| `frontend/src/pages/admin/TagManagerPage.tsx` | 标签列表 + 快速新建 + 删除 |
| `frontend/src/pages/admin/CategoryManagerPage.tsx` | 分类 CRUD（名称/slug/描述） |
| `frontend/src/pages/admin/BookManagerPage.tsx` | 书籍 CRUD（封面/状态/评分） |
| `frontend/src/pages/admin/IssueManagerPage.tsx` | Issue CRUD（状态/优先级） |
| `frontend/src/pages/admin/MusingManagerPage.tsx` | 随想 CRUD（类型/完成状态） |
| `frontend/src/pages/admin/PracticeManagerPage.tsx` | 修炼手册 CRUD（分类/状态/链接） |
| `frontend/src/pages/admin/RoadmapManagerPage.tsx` | Roadmap CRUD（分组/优先级） |
| `frontend/src/pages/admin/SiteManagerPage.tsx` | 网站导航 CRUD |

### 修改文件
| 文件 | 改动 |
|------|------|
| `backend/src/main/java/.../config/SecurityConfig.java` | 新增 7 个模块写操作的 ADMIN 角色规则 |
| `frontend/src/router/index.tsx` | 新增 8 个 lazy 路由 |
| `frontend/src/components/layout/AdminLayout.tsx` | 侧边栏新增"文章体系"和"内容模块"两个分组下的 8 条导航 |
| `frontend/src/styles/components.css` | AdminModal 样式 |

---

## 任务 0：后端安全配置修复

**文件：** 修改 `backend/src/main/java/com/personalsite/blog/config/SecurityConfig.java`

当前问题：`/api/books`、`/api/issues`、`/api/musings`、`/api/roadmap`、`/api/practice`、`/api/sites`、`/api/ai-nodes` 的 POST/PUT/PATCH/DELETE 操作只匹配到 `.anyRequest().authenticated()`，要求"任意已认证用户"而非"ADMIN 角色"。对单管理员系统影响有限但不规范。

- [ ] **步骤 1：在 SecurityConfig 中找到 `.requestMatchers("/api/admin/**").hasRole("ADMIN")` 这一行，在它之前插入 7 个模块的写操作规则**

在 `authorizeHttpRequests` 链中，在 `.requestMatchers("/api/admin/**").hasRole("ADMIN")` **之前**添加：

```java
// 7个模块的写操作（增删改）显式要求 ADMIN 角色
.requestMatchers(HttpMethod.POST,
    "/api/books", "/api/issues", "/api/musings",
    "/api/roadmap", "/api/practice", "/api/sites", "/api/ai-nodes"
).hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT,
    "/api/books/**", "/api/issues/**", "/api/musings/**",
    "/api/roadmap/**", "/api/practice/**", "/api/sites/**", "/api/ai-nodes/**"
).hasRole("ADMIN")
.requestMatchers(HttpMethod.PATCH,
    "/api/issues/**", "/api/musings/**"
).hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE,
    "/api/books/**", "/api/issues/**", "/api/musings/**",
    "/api/roadmap/**", "/api/practice/**", "/api/sites/**", "/api/ai-nodes/**"
).hasRole("ADMIN")
```

完整的 `authorizeHttpRequests` 块变为：
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/tags").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/posts/ai-timeline").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/issues").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/musings").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/books").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/roadmap").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/practice").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/sites").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/ai-nodes").permitAll()
    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
    // 7个模块写操作显式要求 ADMIN
    .requestMatchers(HttpMethod.POST,
        "/api/books", "/api/issues", "/api/musings",
        "/api/roadmap", "/api/practice", "/api/sites", "/api/ai-nodes"
    ).hasRole("ADMIN")
    .requestMatchers(HttpMethod.PUT,
        "/api/books/**", "/api/issues/**", "/api/musings/**",
        "/api/roadmap/**", "/api/practice/**", "/api/sites/**", "/api/ai-nodes/**"
    ).hasRole("ADMIN")
    .requestMatchers(HttpMethod.PATCH,
        "/api/issues/**", "/api/musings/**"
    ).hasRole("ADMIN")
    .requestMatchers(HttpMethod.DELETE,
        "/api/books/**", "/api/issues/**", "/api/musings/**",
        "/api/roadmap/**", "/api/practice/**", "/api/sites/**", "/api/ai-nodes/**"
    ).hasRole("ADMIN")
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .anyRequest().authenticated()
)
```

- [ ] **步骤 2：重启后端，验证未登录时 POST /api/books 返回 401/403**

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:9090/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"test","author":"test","status":"want"}'
# 预期返回：401 或 403
```

- [ ] **步骤 3：Commit**

```bash
git add backend/src/main/java/com/personalsite/blog/config/SecurityConfig.java
git commit -m "security: 为 7 个内容模块的写操作显式要求 ADMIN 角色"
```

---

## 任务 1：AdminModal 可复用弹窗组件

**文件：** 创建 `frontend/src/components/ui/AdminModal.tsx`，更新 `frontend/src/styles/components.css`

所有后续管理页面的创建/编辑表单都使用此组件，避免重复。

- [ ] **步骤 1：创建 AdminModal 组件**

```tsx
// frontend/src/components/ui/AdminModal.tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  children: React.ReactNode;
  saveLabel?: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  open, title, onClose, onSave, saving = false, children, saveLabel = '保存',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="modal-panel">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close-btn" onClick={onClose} aria-label="关闭">
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={saving}>取消</button>
          <button className="btn btn-primary btn-sm" onClick={onSave} disabled={saving}>
            {saving ? '保存中...' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **步骤 2：在 components.css 末尾添加 AdminModal 样式**

```css
/* ─── Admin Modal ─────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-panel {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}
.modal-close-btn:hover { color: var(--color-text-primary); }

.modal-body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}
```

- [ ] **步骤 3：Commit**

```bash
git add frontend/src/components/ui/AdminModal.tsx frontend/src/styles/components.css
git commit -m "feat: 新增 AdminModal 可复用弹窗组件"
```

---

## 任务 2：标签管理页（TagManagerPage）

**文件：** 创建 `frontend/src/pages/admin/TagManagerPage.tsx`

后端接口（已有）：`GET /api/tags`，`POST /api/admin/tags`（body: `{name}`），`DELETE /api/admin/tags/{id}`。
前端 API（`frontend/src/api/tags.ts`）：`getTags()`，`adminCreateTag({name})`，`adminDeleteTag(id)`。

**注意**：当前 `tags.ts` 的类型是 `TagVO {id, name, slug}`，创建时只需传 `name`，后端自动生成 slug。

- [ ] **步骤 1：创建 TagManagerPage**

```tsx
// frontend/src/pages/admin/TagManagerPage.tsx
import React, { useEffect, useState } from 'react';
import { getTags, adminCreateTag, adminDeleteTag } from '../../api/tags';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Tag, Plus, Trash2 } from 'lucide-react';
import type { TagVO } from '../../types/tag';

const TagManagerPage: React.FC = () => {
  const [tags, setTags] = useState<TagVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
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
      await adminCreateTag({ name: newName.trim() });
      setNewName('');
      addToast('标签已创建', 'success');
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '创建失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`确认删除标签「${name}」？关联此标签的文章不受影响。`)) return;
    try {
      await adminDeleteTag(id);
      addToast('已删除', 'success');
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
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

      {/* 快速新建 */}
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
              <button
                className="tag-manage-delete"
                onClick={() => handleDelete(t.id, t.name)}
                title="删除"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagManagerPage;
```

- [ ] **步骤 2：在 components.css 末尾添加标签管理样式**

```css
/* ─── Quick Add Bar ────────────────────────────── */
.quick-add-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: 1.25rem;
}
.quick-add-icon { color: var(--color-text-muted); flex-shrink: 0; }
.quick-add-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}
.quick-add-input::placeholder { color: var(--color-text-muted); }

/* ─── Tag Manage Chips ─────────────────────────── */
.tag-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.empty-hint { color: var(--color-text-muted); font-size: 0.875rem; }

.tag-manage-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.5rem 0.35rem 0.75rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast);
}
.tag-manage-chip:hover { border-color: var(--color-neon-cyan); }
.tag-manage-name { font-size: 0.85rem; color: var(--color-text-primary); }
.tag-manage-slug { font-size: 0.72rem; color: var(--color-text-muted); }
.tag-manage-delete {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  padding: 0.15rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}
.tag-manage-delete:hover { color: var(--color-neon-pink); }
```

- [ ] **步骤 3：Commit**

```bash
git add frontend/src/pages/admin/TagManagerPage.tsx frontend/src/styles/components.css
git commit -m "feat: 新增标签管理页面（/admin/tags）"
```

---

## 任务 3：分类管理页（CategoryManagerPage）

**文件：** 创建 `frontend/src/pages/admin/CategoryManagerPage.tsx`

后端接口：`GET /api/categories`，`POST /api/admin/categories`（body: `{name, slug?, description?}`），`DELETE /api/admin/categories/{id}`。
前端 API（`frontend/src/api/categories.ts`）：`getCategories()`，`adminCreateCategory({name, slug, description})`，`adminDeleteCategory(id)`。

CategoryVO 类型：`{id, name, slug, description?, postCount?}`。

- [ ] **步骤 1：创建 CategoryManagerPage**

```tsx
// frontend/src/pages/admin/CategoryManagerPage.tsx
import React, { useEffect, useState } from 'react';
import { getCategories, adminCreateCategory, adminDeleteCategory } from '../../api/categories';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Folder, Plus, Trash2, Pencil } from 'lucide-react';
import type { CategoryVO } from '../../types/category';

const EMPTY = { name: '', slug: '', description: '' };

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const CategoryManagerPage: React.FC = () => {
  const [cats, setCats] = useState<CategoryVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getCategories()
      .then((r) => setCats(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { addToast('名称不能为空', 'error'); return; }
    setSaving(true);
    try {
      await adminCreateCategory({
        name: form.name.trim(),
        slug: form.slug.trim() || toSlug(form.name),
        description: form.description.trim() || undefined,
      });
      addToast('分类已创建', 'success');
      setModalOpen(false);
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '创建失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`确认删除分类「${name}」？关联文章将变为无分类。`)) return;
    try {
      await adminDeleteCategory(id);
      addToast('已删除', 'success');
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">分类管理</h1>
          <span className="admin-page-count">共 {cats.length} 个</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <Plus size={14} /> 新建分类
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>名称</th>
                <th>Slug</th>
                <th>描述</th>
                <th>文章数</th>
                <th style={{ width: 80 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {cats.length === 0 && (
                <tr><td colSpan={5} className="table-empty-row">暂无分类</td></tr>
              )}
              {cats.map((c) => (
                <tr key={c.id}>
                  <td className="table-title">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Folder size={14} style={{ color: 'var(--color-neon-cyan)', flexShrink: 0 }} />
                      {c.name}
                    </span>
                  </td>
                  <td><code style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{c.slug}</code></td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{c.description || '—'}</td>
                  <td className="table-views">{(c as any).postCount ?? 0}</td>
                  <td className="table-actions">
                    <button className="action-btn delete" onClick={() => handleDelete(c.id, c.name)} title="删除">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} title="新建分类" onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div className="editor-field">
          <label className="form-label">名称 *</label>
          <input value={form.name} onChange={(e) => {
            const n = e.target.value;
            setForm((f) => ({ ...f, name: n, slug: toSlug(n) }));
          }} placeholder="前端开发" />
        </div>
        <div className="editor-field">
          <label className="form-label">Slug（URL 标识）</label>
          <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="自动生成" />
        </div>
        <div className="editor-field">
          <label className="form-label">描述</label>
          <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="可选" />
        </div>
      </AdminModal>
    </div>
  );
};

export default CategoryManagerPage;
```

- [ ] **步骤 2：Commit**

```bash
git add frontend/src/pages/admin/CategoryManagerPage.tsx
git commit -m "feat: 新增分类管理页面（/admin/categories）"
```

---

## 任务 4：书籍管理页（BookManagerPage）

**文件：** 创建 `frontend/src/pages/admin/BookManagerPage.tsx`

API（`frontend/src/api/books.ts`）：`getBooks()`，`createBook(req)`，`updateBook(id, req)`，`deleteBook(id)`。
Book 类型字段：`id, title, author, cover, status('want'|'reading'|'done'), rating(1-5), review, category, totalPages, readPages, startedAt, finishedAt`。

- [ ] **步骤 1：创建 BookManagerPage**

```tsx
// frontend/src/pages/admin/BookManagerPage.tsx
import React, { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../../api/books';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Book, BookRequest } from '../../api/books';

const EMPTY: BookRequest = { title: '', author: '', status: 'want', cover: '', review: '', category: '', rating: undefined, totalPages: undefined };

const STATUS_LABEL: Record<string, string> = { want: '想读', reading: '在读', done: '已读' };
const STATUS_COLOR: Record<string, string> = { want: 'var(--color-text-muted)', reading: 'var(--color-neon-cyan)', done: '#22c55e' };

const BookManagerPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState<BookRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getBooks()
      .then((r) => setBooks(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (b: Book) => {
    setEditing(b);
    setForm({ title: b.title, author: b.author, status: b.status, cover: b.cover ?? '', review: b.review ?? '', category: b.category ?? '', rating: b.rating, totalPages: b.totalPages });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.author.trim()) { addToast('书名和作者不能为空', 'error'); return; }
    setSaving(true);
    try {
      const payload: BookRequest = {
        ...form,
        cover: form.cover?.trim() || undefined,
        review: form.review?.trim() || undefined,
        category: form.category?.trim() || undefined,
      };
      if (editing) {
        await updateBook(editing.id, payload);
        addToast('已更新', 'success');
      } else {
        await createBook(payload);
        addToast('已添加', 'success');
      }
      setModalOpen(false);
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!await showConfirm(`确认删除《${title}》？`)) return;
    try {
      await deleteBook(id);
      addToast('已删除', 'success');
      load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">书籍管理</h1>
          <span className="admin-page-count">共 {books.length} 本</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={14} /> 添加书籍</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>书名</th>
                <th>作者</th>
                <th>分类</th>
                <th>状态</th>
                <th>评分</th>
                <th style={{ width: 90 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 && <tr><td colSpan={6} className="table-empty-row">暂无书籍</td></tr>}
              {books.map((b) => (
                <tr key={b.id}>
                  <td className="table-title">
                    <span className="table-title-link">{b.title}</span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{b.author}</td>
                  <td><span className="table-category-chip">{b.category || '—'}</span></td>
                  <td>
                    <span style={{ color: STATUS_COLOR[b.status], fontSize: '0.8rem', fontWeight: 600 }}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </td>
                  <td className="table-views">{b.rating ? `${b.rating}★` : '—'}</td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(b)} title="编辑"><Pencil size={13} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(b.id, b.title)} title="删除"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? '编辑书籍' : '添加书籍'} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div className="editor-field">
          <label className="form-label">书名 *</label>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="书名" />
        </div>
        <div className="editor-field">
          <label className="form-label">作者 *</label>
          <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="作者" />
        </div>
        <div className="editor-field">
          <label className="form-label">分类</label>
          <input value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="技术/文学/..." />
        </div>
        <div className="editor-field">
          <label className="form-label">状态</label>
          <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as BookRequest['status'] }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="want">想读</SelectItem>
              <SelectItem value="reading">在读</SelectItem>
              <SelectItem value="done">已读</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="editor-field">
          <label className="form-label">评分（1-5）</label>
          <input type="number" min={1} max={5} value={form.rating ?? ''} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value ? Number(e.target.value) : undefined }))} placeholder="可选" />
        </div>
        <div className="editor-field">
          <label className="form-label">封面图 URL</label>
          <input value={form.cover ?? ''} onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))} placeholder="https://..." />
        </div>
        <div className="editor-field">
          <label className="form-label">短评</label>
          <textarea rows={3} value={form.review ?? ''} onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))} placeholder="可选" />
        </div>
      </AdminModal>
    </div>
  );
};

export default BookManagerPage;
```

- [ ] **步骤 2：Commit**

```bash
git add frontend/src/pages/admin/BookManagerPage.tsx
git commit -m "feat: 新增书籍管理页面（/admin/books）"
```

---

## 任务 5：Issue 管理页（IssueManagerPage）

**文件：** 创建 `frontend/src/pages/admin/IssueManagerPage.tsx`

API：`getIssues()`，`createIssue(req)`，`updateIssue(id,req)`，`updateIssueStatus(id,status)`，`deleteIssue(id)`。
Issue 类型字段：`id, title, description, status(0=todo/1=in_progress/2=done), priority(0=low/1=medium/2=high)`。

- [ ] **步骤 1：创建 IssueManagerPage**

```tsx
// frontend/src/pages/admin/IssueManagerPage.tsx
import React, { useEffect, useState } from 'react';
import { getIssues, createIssue, updateIssue, updateIssueStatus, deleteIssue } from '../../api/issues';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Issue, IssueRequest } from '../../api/issues';

const EMPTY: IssueRequest = { title: '', description: '', status: 0, priority: 1 };

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: 'Todo', color: 'var(--color-text-muted)' },
  1: { label: '进行中', color: 'var(--color-neon-cyan)' },
  2: { label: '已完成', color: '#22c55e' },
};
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
    setForm({ title: i.title, description: i.description ?? '', status: i.status, priority: i.priority });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { addToast('标题不能为空', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await updateIssue(editing.id, form); addToast('已更新', 'success'); }
      else { await createIssue(form); addToast('已创建', 'success'); }
      setModalOpen(false); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id: number, status: number) => {
    try {
      await updateIssueStatus(id, status);
      setIssues((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '状态更新失败'); if (msg) addToast(msg, 'error');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!await showConfirm(`确认删除「${title}」？`)) return;
    try {
      await deleteIssue(id);
      addToast('已删除', 'success'); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">Issue 管理</h1>
          <span className="admin-page-count">共 {issues.length} 条</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={14} /> 新建 Issue</button>
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
              {issues.length === 0 && <tr><td colSpan={4} className="table-empty-row">暂无 Issue</td></tr>}
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
                      onChange={(e) => handleStatusChange(i.id, Number(e.target.value))}
                    >
                      <option value={0}>Todo</option>
                      <option value={1}>进行中</option>
                      <option value={2}>已完成</option>
                    </select>
                  </td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(i)} title="编辑"><Pencil size={13} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(i.id, i.title)} title="删除"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? '编辑 Issue' : '新建 Issue'} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div className="editor-field">
          <label className="form-label">标题 *</label>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Issue 标题" />
        </div>
        <div className="editor-field">
          <label className="form-label">描述</label>
          <textarea rows={3} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="可选" />
        </div>
        <div className="editor-field">
          <label className="form-label">优先级</label>
          <Select value={String(form.priority)} onValueChange={(v) => setForm((f) => ({ ...f, priority: Number(v) as 0|1|2 }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0">低</SelectItem>
              <SelectItem value="1">中</SelectItem>
              <SelectItem value="2">高</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="editor-field">
          <label className="form-label">状态</label>
          <Select value={String(form.status)} onValueChange={(v) => setForm((f) => ({ ...f, status: Number(v) as 0|1|2 }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Todo</SelectItem>
              <SelectItem value="1">进行中</SelectItem>
              <SelectItem value="2">已完成</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminModal>
    </div>
  );
};

export default IssueManagerPage;
```

- [ ] **步骤 2：在 components.css 添加 inline-status-select 样式**

```css
/* ─── Inline Status Select ─────────────────────── */
.inline-status-select {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}
.inline-status-select:focus { outline: none; border-color: var(--color-neon-cyan); }
```

- [ ] **步骤 3：Commit**

```bash
git add frontend/src/pages/admin/IssueManagerPage.tsx frontend/src/styles/components.css
git commit -m "feat: 新增 Issue 管理页面（/admin/issues）"
```

---

## 任务 6：随想录管理页（MusingManagerPage）

**文件：** 创建 `frontend/src/pages/admin/MusingManagerPage.tsx`

API：`getMusings()`，`createMusing(req)`，`updateMusing(id,req)`，`toggleMusingDone(id)`，`deleteMusing(id)`。
Musing 类型：`id, content, type('idea'|'todo'), done, createdAt`。

- [ ] **步骤 1：创建 MusingManagerPage**

```tsx
// frontend/src/pages/admin/MusingManagerPage.tsx
import React, { useEffect, useState } from 'react';
import { getMusings, createMusing, updateMusing, toggleMusingDone, deleteMusing } from '../../api/musings';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import { format } from 'date-fns';
import type { Musing, MusingRequest } from '../../api/musings';

const EMPTY: MusingRequest = { content: '', type: 'idea', done: false };

const MusingManagerPage: React.FC = () => {
  const [musings, setMusings] = useState<Musing[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Musing | null>(null);
  const [form, setForm] = useState<MusingRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getMusings()
      .then((r) => setMusings(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (m: Musing) => {
    setEditing(m);
    setForm({ content: m.content, type: m.type, done: m.done });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.content.trim()) { addToast('内容不能为空', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await updateMusing(editing.id, form); addToast('已更新', 'success'); }
      else { await createMusing(form); addToast('已创建', 'success'); }
      setModalOpen(false); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleMusingDone(id);
      setMusings((prev) => prev.map((m) => m.id === id ? { ...m, done: !m.done } : m));
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '操作失败'); if (msg) addToast(msg, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!await showConfirm('确认删除这条随想？')) return;
    try {
      await deleteMusing(id);
      addToast('已删除', 'success'); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">随想录管理</h1>
          <span className="admin-page-count">共 {musings.length} 条</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={14} /> 新建随想</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>内容</th>
                <th>类型</th>
                <th>完成</th>
                <th>创建时间</th>
                <th style={{ width: 90 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {musings.length === 0 && <tr><td colSpan={5} className="table-empty-row">暂无随想</td></tr>}
              {musings.map((m) => (
                <tr key={m.id} style={{ opacity: m.done ? 0.6 : 1 }}>
                  <td className="table-title">
                    <span style={{ textDecoration: m.done ? 'line-through' : 'none' }}>{m.content}</span>
                  </td>
                  <td><span className="table-category-chip">{m.type === 'idea' ? '💡 想法' : '✅ Todo'}</span></td>
                  <td>
                    <button
                      className={`action-btn ${m.done ? 'toggle' : 'edit'}`}
                      onClick={() => handleToggle(m.id)}
                      title={m.done ? '标为未完成' : '标为完成'}
                    >
                      <Check size={13} />
                    </button>
                  </td>
                  <td className="table-date">{format(new Date(m.createdAt), 'yyyy-MM-dd')}</td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(m)} title="编辑"><Pencil size={13} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(m.id)} title="删除"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? '编辑随想' : '新建随想'} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div className="editor-field">
          <label className="form-label">内容 *</label>
          <textarea rows={4} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="写下你的想法..." />
        </div>
        <div className="editor-field">
          <label className="form-label">类型</label>
          <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as 'idea' | 'todo' }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="idea">💡 想法</SelectItem>
              <SelectItem value="todo">✅ Todo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminModal>
    </div>
  );
};

export default MusingManagerPage;
```

- [ ] **步骤 2：Commit**

```bash
git add frontend/src/pages/admin/MusingManagerPage.tsx
git commit -m "feat: 新增随想录管理页面（/admin/musings）"
```

---

## 任务 7：修炼手册管理页（PracticeManagerPage）

**文件：** 创建 `frontend/src/pages/admin/PracticeManagerPage.tsx`

API：`getPractices()`，`createPractice(req)`，`updatePractice(id,req)`，`deletePractice(id)`。
Practice 字段：`id, category, categoryIcon, name, description, status('todo'|'in_progress'|'mastered'), links([{title,url}]), sortOrder`。
PracticeRequest 字段：`category, categoryIcon, name, description, status, links, sortOrder`。

Links 字段用动态行编辑（最多 5 条）。

- [ ] **步骤 1：创建 PracticeManagerPage**

```tsx
// frontend/src/pages/admin/PracticeManagerPage.tsx
import React, { useEffect, useState } from 'react';
import { getPractices, createPractice, updatePractice, deletePractice } from '../../api/practice';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2, Link as LinkIcon, X } from 'lucide-react';
import type { Practice, PracticeRequest } from '../../api/practice';

const EMPTY: PracticeRequest = { category: '', name: '', status: 'todo', links: [], sortOrder: 0 };
const STATUS_LABEL: Record<string, string> = { todo: '待学习', in_progress: '学习中', mastered: '已掌握' };
const STATUS_COLOR: Record<string, string> = {
  todo: 'var(--color-text-muted)',
  in_progress: 'var(--color-neon-cyan)',
  mastered: '#22c55e',
};

const PracticeManagerPage: React.FC = () => {
  const [items, setItems] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Practice | null>(null);
  const [form, setForm] = useState<PracticeRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getPractices()
      .then((r) => setItems(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (p: Practice) => {
    setEditing(p);
    setForm({ category: p.category, categoryIcon: p.categoryIcon ?? '', name: p.name, description: p.description ?? '', status: p.status, links: p.links ?? [], sortOrder: p.sortOrder ?? 0 });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.category.trim() || !form.name.trim()) { addToast('分类和名称不能为空', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await updatePractice(editing.id, form); addToast('已更新', 'success'); }
      else { await createPractice(form); addToast('已创建', 'success'); }
      setModalOpen(false); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`确认删除「${name}」？`)) return;
    try { await deletePractice(id); addToast('已删除', 'success'); load(); }
    catch (e: unknown) { const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error'); }
  };

  const addLink = () => {
    if ((form.links?.length ?? 0) >= 5) return;
    setForm((f) => ({ ...f, links: [...(f.links ?? []), { title: '', url: '' }] }));
  };
  const updateLink = (i: number, field: 'title' | 'url', val: string) => {
    setForm((f) => ({ ...f, links: (f.links ?? []).map((l, idx) => idx === i ? { ...l, [field]: val } : l) }));
  };
  const removeLink = (i: number) => {
    setForm((f) => ({ ...f, links: (f.links ?? []).filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">修炼手册管理</h1>
          <span className="admin-page-count">共 {items.length} 条</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={14} /> 新增条目</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>分类</th><th>名称</th><th>状态</th><th>链接数</th><th style={{ width: 90 }}>操作</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={5} className="table-empty-row">暂无条目</td></tr>}
              {items.map((p) => (
                <tr key={p.id}>
                  <td><span className="table-category-chip">{p.categoryIcon} {p.category}</span></td>
                  <td className="table-title"><span className="table-title-link">{p.name}</span></td>
                  <td><span style={{ color: STATUS_COLOR[p.status], fontSize: '0.8rem', fontWeight: 600 }}>{STATUS_LABEL[p.status]}</span></td>
                  <td className="table-views">{p.links?.length ?? 0}</td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(p)} title="编辑"><Pencil size={13} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(p.id, p.name)} title="删除"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? '编辑条目' : '新增条目'} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="editor-field">
            <label className="form-label">分类 *</label>
            <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="算法/前端/..." />
          </div>
          <div className="editor-field">
            <label className="form-label">分类图标（emoji）</label>
            <input value={form.categoryIcon ?? ''} onChange={(e) => setForm((f) => ({ ...f, categoryIcon: e.target.value }))} placeholder="🎯" />
          </div>
        </div>
        <div className="editor-field">
          <label className="form-label">名称 *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="条目名称" />
        </div>
        <div className="editor-field">
          <label className="form-label">描述</label>
          <textarea rows={2} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="可选" />
        </div>
        <div className="editor-field">
          <label className="form-label">状态</label>
          <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as PracticeRequest['status'] }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">待学习</SelectItem>
              <SelectItem value="in_progress">学习中</SelectItem>
              <SelectItem value="mastered">已掌握</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="editor-field">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>参考链接</label>
            <button className="btn btn-ghost btn-sm" onClick={addLink} disabled={(form.links?.length ?? 0) >= 5}>
              <Plus size={12} /> 添加
            </button>
          </div>
          {(form.links ?? []).map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <input style={{ flex: 1 }} value={l.title} onChange={(e) => updateLink(i, 'title', e.target.value)} placeholder="标题" />
              <input style={{ flex: 2 }} value={l.url} onChange={(e) => updateLink(i, 'url', e.target.value)} placeholder="https://..." />
              <button className="action-btn delete" onClick={() => removeLink(i)} title="删除"><X size={12} /></button>
            </div>
          ))}
        </div>
      </AdminModal>
    </div>
  );
};

export default PracticeManagerPage;
```

- [ ] **步骤 2：Commit**

```bash
git add frontend/src/pages/admin/PracticeManagerPage.tsx
git commit -m "feat: 新增修炼手册管理页面（/admin/practice）"
```

---

## 任务 8：Roadmap 管理页（RoadmapManagerPage）

**文件：** 创建 `frontend/src/pages/admin/RoadmapManagerPage.tsx`

API：`getRoadmapItems()`，`createRoadmapItem(req)`，`updateRoadmapItem(id,req)`，`deleteRoadmapItem(id)`。
RoadmapItem 字段：`id, groupLabel, groupIcon, name, description, status('done'|'planned'), priority('low'|'medium'|'high'), sortOrder`。

- [ ] **步骤 1：创建 RoadmapManagerPage**

```tsx
// frontend/src/pages/admin/RoadmapManagerPage.tsx
import React, { useEffect, useState } from 'react';
import { getRoadmapItems, createRoadmapItem, updateRoadmapItem, deleteRoadmapItem } from '../../api/roadmap';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AdminModal } from '../../components/ui/AdminModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/shadcn/Select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { RoadmapItem, RoadmapItemRequest } from '../../api/roadmap';

const EMPTY: RoadmapItemRequest = { groupLabel: '', name: '', status: 'planned', priority: 'medium', sortOrder: 0 };

const STATUS_COLOR: Record<string, string> = { done: '#22c55e', planned: 'var(--color-neon-cyan)' };
const PRIORITY_COLOR: Record<string, string> = { low: 'var(--color-text-muted)', medium: '#f97316', high: 'var(--color-neon-pink)' };

const RoadmapManagerPage: React.FC = () => {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoadmapItem | null>(null);
  const [form, setForm] = useState<RoadmapItemRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addToast, showConfirm } = useUiStore();

  const load = () => {
    setLoading(true);
    getRoadmapItems()
      .then((r) => setItems(r.data ?? []))
      .catch(() => addToast('加载失败', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (item: RoadmapItem) => {
    setEditing(item);
    setForm({ groupLabel: item.groupLabel, groupIcon: item.groupIcon ?? '', name: item.name, description: item.description ?? '', status: item.status, priority: item.priority, sortOrder: item.sortOrder ?? 0 });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.groupLabel.trim() || !form.name.trim()) { addToast('分组和名称不能为空', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await updateRoadmapItem(editing.id, form); addToast('已更新', 'success'); }
      else { await createRoadmapItem(form); addToast('已创建', 'success'); }
      setModalOpen(false); load();
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '保存失败'); if (msg) addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`确认删除「${name}」？`)) return;
    try { await deleteRoadmapItem(id); addToast('已删除', 'success'); load(); }
    catch (e: unknown) { const msg = getErrorMessage(e, '删除失败'); if (msg) addToast(msg, 'error'); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">Roadmap 管理</h1>
          <span className="admin-page-count">共 {items.length} 条</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={14} /> 新增功能</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>分组</th><th>功能名称</th><th>状态</th><th>优先级</th><th style={{ width: 90 }}>操作</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={5} className="table-empty-row">暂无条目</td></tr>}
              {items.map((item) => (
                <tr key={item.id}>
                  <td><span className="table-category-chip">{item.groupIcon} {item.groupLabel}</span></td>
                  <td className="table-title">
                    <span className="table-title-link">{item.name}</span>
                    {item.description && <p className="table-summary">{item.description}</p>}
                  </td>
                  <td><span style={{ color: STATUS_COLOR[item.status], fontSize: '0.8rem', fontWeight: 600 }}>{item.status === 'done' ? '已完成' : '规划中'}</span></td>
                  <td><span style={{ color: PRIORITY_COLOR[item.priority], fontSize: '0.8rem', fontWeight: 600 }}>{({ low: '低', medium: '中', high: '高' })[item.priority]}</span></td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => openEdit(item)} title="编辑"><Pencil size={13} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(item.id, item.name)} title="删除"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? '编辑功能' : '新增功能'} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="editor-field">
            <label className="form-label">分组名称 *</label>
            <input value={form.groupLabel} onChange={(e) => setForm((f) => ({ ...f, groupLabel: e.target.value }))} placeholder="核心功能" />
          </div>
          <div className="editor-field">
            <label className="form-label">分组图标（emoji）</label>
            <input value={form.groupIcon ?? ''} onChange={(e) => setForm((f) => ({ ...f, groupIcon: e.target.value }))} placeholder="🚀" />
          </div>
        </div>
        <div className="editor-field">
          <label className="form-label">功能名称 *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="功能名称" />
        </div>
        <div className="editor-field">
          <label className="form-label">描述</label>
          <textarea rows={2} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="可选" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="editor-field">
            <label className="form-label">状态</label>
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as 'done' | 'planned' }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">规划中</SelectItem>
                <SelectItem value="done">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="editor-field">
            <label className="form-label">优先级</label>
            <Select value={form.priority ?? 'medium'} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as 'low'|'medium'|'high' }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="high">高</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default RoadmapManagerPage;
```

- [ ] **步骤 2：Commit**

```bash
git add frontend/src/pages/admin/RoadmapManagerPage.tsx
git commit -m "feat: 新增 Roadmap 管理页面（/admin/roadmap）"
```

---

## 任务 9：网站导航管理页（SiteManagerPage）

**文件：** 创建 `frontend/src/pages/admin/SiteManagerPage.tsx`

API（`frontend/src/api/sites.ts`，已存在）：`getSites()`，`createSite(req)`，`updateSite(id,req)`，`deleteSite(id)`。
Site 字段：`id, name, url, category, sortOrder`。

- [ ] **步骤 1：创建 SiteManagerPage**

```tsx
// frontend/src/pages/admin/SiteManagerPage.tsx
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
                    <a href={s.url} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-neon-cyan)', fontSize: '0.8rem', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
```

- [ ] **步骤 2：Commit**

```bash
git add frontend/src/pages/admin/SiteManagerPage.tsx
git commit -m "feat: 新增网站导航管理页面（/admin/sites）"
```

---

## 任务 10：路由 + 侧边栏更新

**文件：** 修改 `frontend/src/router/index.tsx`，修改 `frontend/src/components/layout/AdminLayout.tsx`

- [ ] **步骤 1：更新 router/index.tsx，添加 8 个新路由**

在现有 lazy 导入之后，新增：

```tsx
const TagManagerPage     = lazy(() => import('../pages/admin/TagManagerPage'));
const CategoryManagerPage = lazy(() => import('../pages/admin/CategoryManagerPage'));
const BookManagerPage    = lazy(() => import('../pages/admin/BookManagerPage'));
const IssueManagerPage   = lazy(() => import('../pages/admin/IssueManagerPage'));
const MusingManagerPage  = lazy(() => import('../pages/admin/MusingManagerPage'));
const PracticeManagerPage = lazy(() => import('../pages/admin/PracticeManagerPage'));
const RoadmapManagerPage = lazy(() => import('../pages/admin/RoadmapManagerPage'));
const SiteManagerPage    = lazy(() => import('../pages/admin/SiteManagerPage'));
```

在 `/admin` 的 `children` 数组中追加：

```tsx
{ path: 'tags',       element: <Suspense fallback={<LoadingSpinner fullPage />}><TagManagerPage /></Suspense> },
{ path: 'categories', element: <Suspense fallback={<LoadingSpinner fullPage />}><CategoryManagerPage /></Suspense> },
{ path: 'books',      element: <Suspense fallback={<LoadingSpinner fullPage />}><BookManagerPage /></Suspense> },
{ path: 'issues',     element: <Suspense fallback={<LoadingSpinner fullPage />}><IssueManagerPage /></Suspense> },
{ path: 'musings',    element: <Suspense fallback={<LoadingSpinner fullPage />}><MusingManagerPage /></Suspense> },
{ path: 'practice',   element: <Suspense fallback={<LoadingSpinner fullPage />}><PracticeManagerPage /></Suspense> },
{ path: 'roadmap',    element: <Suspense fallback={<LoadingSpinner fullPage />}><RoadmapManagerPage /></Suspense> },
{ path: 'sites',      element: <Suspense fallback={<LoadingSpinner fullPage />}><SiteManagerPage /></Suspense> },
```

- [ ] **步骤 2：更新 AdminLayout.tsx 侧边栏导航**

更新 `navItems` 数组为三个分组：

```tsx
import {
  LayoutDashboard, FileText, FilePlus, ChevronLeft, ChevronRight,
  LogOut, User, Zap, Tag, Folder, BookOpen, AlertCircle,
  MessageSquare, Dumbbell, Map, Globe,
} from 'lucide-react';

const navItems = [
  {
    group: '概览',
    items: [
      { to: '/admin/dashboard', label: '仪表盘', icon: LayoutDashboard, active: undefined as boolean | undefined },
    ],
  },
  {
    group: '文章',
    items: [
      { to: '/admin/posts',     label: '文章管理', icon: FileText,  active: isPostsActive },
      { to: '/admin/posts/new', label: '写新文章', icon: FilePlus,  active: isEditorActive },
      { to: '/admin/tags',      label: '标签管理', icon: Tag,       active: undefined },
      { to: '/admin/categories',label: '分类管理', icon: Folder,    active: undefined },
    ],
  },
  {
    group: '内容模块',
    items: [
      { to: '/admin/books',    label: '书籍',     icon: BookOpen,      active: undefined },
      { to: '/admin/issues',   label: 'Issue',    icon: AlertCircle,   active: undefined },
      { to: '/admin/musings',  label: '随想录',   icon: MessageSquare, active: undefined },
      { to: '/admin/practice', label: '修炼手册', icon: Dumbbell,      active: undefined },
      { to: '/admin/roadmap',  label: 'Roadmap',  icon: Map,           active: undefined },
      { to: '/admin/sites',    label: '网站导航', icon: Globe,         active: undefined },
    ],
  },
];
```

- [ ] **步骤 3：运行 TypeScript 检查**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep -v "MarkdownRenderer\|CustomSelect\|MusingPage\|RoadmapPage" | head -20
```

预期：无新增错误。

- [ ] **步骤 4：Commit**

```bash
git add frontend/src/router/index.tsx frontend/src/components/layout/AdminLayout.tsx
git commit -m "feat: 路由 + 侧边栏接入 8 个新管理页面"
```

---

## 任务 11：最终验证 + 构建

- [ ] **步骤 1：验证 Vite 构建成功**

```bash
cd frontend && npx vite build 2>&1 | tail -5
# 预期：✓ built in X.XXs
```

- [ ] **步骤 2：验证后端安全配置（未携带 Token 时写操作被拒绝）**

```bash
# 应返回 401 或 403
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:9090/api/books \
  -H "Content-Type: application/json" -d '{"title":"t","author":"a","status":"want"}'

curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:9090/api/issues/999
```

- [ ] **步骤 3：最终总结 Commit（如有遗漏文件）**

```bash
git add -A
git commit -m "chore: 管理后台功能补全（标签/分类/书籍/Issue/随想/修炼/Roadmap/网站导航）" --allow-empty
```

---

## 自检核对

| 需求 | 覆盖任务 |
|------|---------|
| 后端 7 个模块写操作加 ADMIN 认证 | 任务 0 |
| AdminModal 可复用弹窗 | 任务 1 |
| 标签管理页 `/admin/tags` | 任务 2 |
| 分类管理页 `/admin/categories` | 任务 3 |
| 书籍管理页 `/admin/books` | 任务 4 |
| Issue 管理页 `/admin/issues` | 任务 5 |
| 随想录管理页 `/admin/musings` | 任务 6 |
| 修炼手册管理页 `/admin/practice` | 任务 7 |
| Roadmap 管理页 `/admin/roadmap` | 任务 8 |
| 网站导航管理页 `/admin/sites` | 任务 9 |
| 路由 + 侧边栏更新 | 任务 10 |
| 构建验证 + 安全验证 | 任务 11 |
