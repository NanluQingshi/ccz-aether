import { useState } from 'react';
import { getErrorMessage } from '../api/client';
import { useUiStore } from '../store/uiStore';

/**
 * 封装模态框 CRUD 页面通用状态与操作。
 * 适用于 showForm / editingId / form / submitting 四件套模式。
 */
export function useCRUDPage<T extends { id: number }, F>(opts: {
  emptyForm: F;
  toForm: (item: T) => F;
}) {
  const { addToast, showConfirm } = useUiStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<F>(opts.emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(opts.emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: T) => {
    setEditingId(item.id);
    setForm(opts.toForm(item));
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  /** 包裹异步提交：管理 submitting 状态 + 统一错误 toast。asyncFn 负责调用 API、显示成功 toast、关闭表单。 */
  const handleSubmit = async (asyncFn: () => Promise<void>) => {
    setSubmitting(true);
    try {
      await asyncFn();
    } catch (err: unknown) {
      const msg = getErrorMessage(err, '操作失败');
      if (msg) addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /** 包裹删除：弹确认框 + 调用 deleteFn + 执行 afterDelete 回调 + 统一 toast。 */
  const handleDelete = async (
    id: number,
    deleteFn: (id: number) => Promise<unknown>,
    afterDelete: () => void,
    confirmMsg = '确认删除？',
  ) => {
    if (!await showConfirm(confirmMsg)) return;
    try {
      await deleteFn(id);
      afterDelete();
      addToast('已删除', 'success');
    } catch (err: unknown) {
      const msg = getErrorMessage(err, '删除失败');
      if (msg) addToast(msg, 'error');
    }
  };

  return {
    showForm,
    editingId,
    form,
    submitting,
    setForm,
    openCreate,
    openEdit,
    closeForm,
    handleSubmit,
    handleDelete,
    addToast,
  };
}
