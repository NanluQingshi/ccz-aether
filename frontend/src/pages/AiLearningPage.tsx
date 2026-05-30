import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from '@dagrejs/dagre';
import { Plus, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { usePageData } from '../hooks/usePageData';
import { getErrorMessage } from '../api/client';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/shadcn/Select';
import { AiTreeNode } from '../components/ai-learning/AiTreeNode';
import type { AiTreeNodeData } from '../components/ai-learning/AiTreeNode';
import {
  getAiNodes, createAiNode, updateAiNode, deleteAiNode,
  AiNodeStatus,
} from '../api/aiLearning';
import type { AiNode, AiNodeRequest, AiNodeResource } from '../api/aiLearning';

const NODE_W = 210;
const NODE_H = 100;
const nodeTypes = { aiTreeNode: AiTreeNode };

function buildGraph(
  nodes: AiNode[],
  cbs: Pick<AiTreeNodeData, 'isAdmin' | 'onEdit' | 'onDelete' | 'onAddChild'>,
): { nodes: Node[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes: [], edges: [] };

  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', nodesep: 70, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));
  nodes.forEach((n) => g.setNode(String(n.id), { width: NODE_W, height: NODE_H }));
  nodes.forEach((n) => { if (n.parentId != null) g.setEdge(String(n.parentId), String(n.id)); });
  dagre.layout(g);

  const rfNodes: Node[] = nodes.map((n) => {
    const { x, y } = g.node(String(n.id));
    return {
      id: String(n.id),
      type: 'aiTreeNode',
      position: { x: x - NODE_W / 2, y: y - NODE_H / 2 },
      data: { ...n, ...cbs },
    };
  });
  const rfEdges: Edge[] = nodes
    .filter((n) => n.parentId != null)
    .map((n) => ({
      id: `e-${n.parentId}-${n.id}`,
      source: String(n.parentId),
      target: String(n.id),
      type: 'smoothstep',
      style: { stroke: '#334155', strokeWidth: 1.5 },
    }));

  return { nodes: rfNodes, edges: rfEdges };
}

const EMPTY: AiNodeRequest = {
  title: '', description: '', icon: '',
  status: AiNodeStatus.NOT_STARTED,
  parentId: undefined, resources: [], sortOrder: 0,
};

export default function AiLearningPage() {
  const { token } = useAuthStore();
  const { addToast, showConfirm } = useUiStore();
  const isAdmin = !!token;

  const { data: rawNodes, loading, reload } = usePageData(getAiNodes);
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AiNodeRequest>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = useCallback((parentId?: number) => {
    setEditingId(null);
    setForm({ ...EMPTY, parentId: parentId ?? undefined });
    setShowForm(true);
  }, []);

  const openEdit = useCallback((node: AiNode) => {
    setEditingId(node.id);
    setForm({
      title: node.title,
      description: node.description ?? '',
      icon: node.icon ?? '',
      status: node.status,
      parentId: node.parentId,
      resources: node.resources ?? [],
      sortOrder: node.sortOrder,
    });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    const ok = await showConfirm('删除该节点将同时删除所有子节点，确认删除？');
    if (!ok) return;
    try {
      await deleteAiNode(id);
      addToast('已删除', 'success');
      reload();
    } catch (e) {
      const msg = getErrorMessage(e, '删除失败');
      if (msg) addToast(msg, 'error');
    }
  }, [showConfirm, addToast, reload]);

  useEffect(() => {
    const { nodes, edges } = buildGraph(rawNodes, {
      isAdmin,
      onEdit: openEdit,
      onDelete: handleDelete,
      onAddChild: openCreate,
    });
    setRfNodes(nodes);
    setRfEdges(edges);
  }, [rawNodes, isAdmin, openEdit, handleDelete, openCreate, setRfNodes, setRfEdges]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) return;
    setSubmitting(true);
    try {
      const payload: AiNodeRequest = {
        ...form,
        title: form.title.trim(),
        sortOrder: form.sortOrder ?? 0,
        resources: form.resources ?? [],
      };
      if (editingId !== null) {
        await updateAiNode(editingId, payload);
        addToast('已更新', 'success');
      } else {
        await createAiNode(payload);
        addToast('已创建', 'success');
      }
      setShowForm(false);
      reload();
    } catch (e) {
      const msg = getErrorMessage(e, '操作失败');
      if (msg) addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const addResource = () =>
    setForm((f) => ({ ...f, resources: [...(f.resources ?? []), { title: '', url: '' }] }));

  const removeResource = (i: number) =>
    setForm((f) => ({ ...f, resources: (f.resources ?? []).filter((_, idx) => idx !== i) }));

  const updateResource = (i: number, field: keyof AiNodeResource, val: string) =>
    setForm((f) => ({
      ...f,
      resources: (f.resources ?? []).map((r, idx) => idx === i ? { ...r, [field]: val } : r),
    }));

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="ai-learning-page">
      <div className="container">
        <div className="ai-learning-header">
          <h1 className="page-title">AI 学习路线</h1>
          <p className="page-subtitle">探索 AI 领域的知识体系与学习路径</p>
          <div className="ai-learning-legend">
            <span className="ai-legend-dot" style={{ background: '#64748b' }} />
            <span className="ai-legend-label">未开始</span>
            <span className="ai-legend-dot" style={{ background: '#00f5ff' }} />
            <span className="ai-legend-label">学习中</span>
            <span className="ai-legend-dot" style={{ background: '#4ade80' }} />
            <span className="ai-legend-label">已完成</span>
          </div>
        </div>
      </div>

      {rawNodes.length === 0 ? (
        <div className="ai-learning-empty">
          <p>暂无学习路线，{isAdmin ? '点击按钮开始构建' : '管理员尚未添加内容'}</p>
          {isAdmin && (
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => openCreate()}>
              <Plus size={14} style={{ marginRight: 4 }} />添加根节点
            </button>
          )}
        </div>
      ) : (
        <div className="ai-learning-canvas">
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            minZoom={0.2}
            maxZoom={2}
            attributionPosition="bottom-left"
          >
            <Background color="#1e293b" gap={24} />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const s = (n.data as AiTreeNodeData)?.status;
                return s === 'completed' ? '#4ade80' : s === 'in_progress' ? '#00f5ff' : '#334155';
              }}
              style={{ background: '#0a0e1a' }}
              zoomable
              pannable
            />
          </ReactFlow>
        </div>
      )}

      {isAdmin && rawNodes.length > 0 && (
        <button className="ai-learning-fab" onClick={() => openCreate()} title="添加根节点">
          <Plus size={18} />
        </button>
      )}

      {showForm && (
        <div className="issue-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="issue-modal-title">
              {editingId !== null ? '编辑节点' : form.parentId ? '添加子节点' : '添加根节点'}
            </h3>
            <form onSubmit={handleSubmit} className="issue-form">
              <div className="form-group">
                <label className="form-label">标题 *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="节点标题"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">描述</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="可选，简短描述该知识点"
                  rows={2}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">图标（emoji）</label>
                  <input
                    value={form.icon ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                    placeholder="🤖"
                    maxLength={4}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">排序（越小越靠前）</label>
                  <input
                    type="number"
                    value={form.sortOrder ?? 0}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">状态</label>
                <Select
                  value={form.status ?? AiNodeStatus.NOT_STARTED}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as AiNodeStatus }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AiNodeStatus.NOT_STARTED}>未开始</SelectItem>
                    <SelectItem value={AiNodeStatus.IN_PROGRESS}>学习中</SelectItem>
                    <SelectItem value={AiNodeStatus.COMPLETED}>已完成</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>参考资源</label>
                  <button type="button" className="btn btn-soft btn-sm" onClick={addResource}>+ 添加</button>
                </div>
                {(form.resources ?? []).map((r, i) => (
                  <div key={i} className="practice-link-row">
                    <input
                      value={r.title}
                      onChange={(e) => updateResource(i, 'title', e.target.value)}
                      placeholder="标题"
                      style={{ flex: '0 0 110px' }}
                    />
                    <input
                      value={r.url}
                      onChange={(e) => updateResource(i, 'url', e.target.value)}
                      placeholder="URL"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="issue-action-btn danger" onClick={() => removeResource(i)}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
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
}
