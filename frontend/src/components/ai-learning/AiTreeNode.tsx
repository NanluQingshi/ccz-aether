import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Pencil, Trash2, Plus } from 'lucide-react';
import type { AiNode, AiNodeStatus } from '../../api/aiLearning';

export type AiTreeNodeData = AiNode & {
  isAdmin: boolean;
  onEdit: (node: AiNode) => void;
  onDelete: (id: number) => void;
  onAddChild: (parentId: number) => void;
};

const STATUS_COLOR: Record<AiNodeStatus, string> = {
  not_started: '#64748b',
  in_progress: '#00f5ff',
  completed: '#4ade80',
};

const STATUS_LABEL: Record<AiNodeStatus, string> = {
  not_started: '未开始',
  in_progress: '学习中',
  completed: '已完成',
};

export const AiTreeNode: React.FC<NodeProps<AiTreeNodeData>> = ({ data }) => {
  const color = STATUS_COLOR[data.status] ?? STATUS_COLOR.not_started;
  const label = STATUS_LABEL[data.status] ?? '未开始';

  return (
    <div className={`ai-tree-node ai-tree-node--${data.status}`} style={{ borderColor: color }}>
      <Handle type="target" position={Position.Top} style={{ background: color }} />

      <div className="ai-tree-node-body">
        <div className="ai-tree-node-header">
          {data.icon && <span className="ai-tree-node-icon">{data.icon}</span>}
          <span className="ai-tree-node-title">{data.title}</span>
        </div>
        {data.description && (
          <p className="ai-tree-node-desc">{data.description}</p>
        )}
        <span className="ai-tree-node-status" style={{ color }}>
          {label}
        </span>
      </div>

      {data.isAdmin && (
        <div className="ai-tree-node-admin">
          <button
            className="ai-node-action-btn"
            title="添加子节点"
            onClick={(e) => { e.stopPropagation(); data.onAddChild(data.id); }}
          >
            <Plus size={11} />
          </button>
          <button
            className="ai-node-action-btn"
            title="编辑"
            onClick={(e) => { e.stopPropagation(); data.onEdit(data); }}
          >
            <Pencil size={11} />
          </button>
          <button
            className="ai-node-action-btn ai-node-action-btn--danger"
            title="删除"
            onClick={(e) => { e.stopPropagation(); data.onDelete(data.id); }}
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: color }} />
    </div>
  );
};
