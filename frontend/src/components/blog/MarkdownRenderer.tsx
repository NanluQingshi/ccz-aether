import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import '../../styles/markdown.css';

// 定义在组件外部，保持引用稳定，避免 react-markdown 因数组重建而重新解析内容
const REMARK_PLUGINS = [remarkGfm] as const;
const REHYPE_PLUGINS = [
  rehypeHighlight,
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
] as const;

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => (
  <div className="prose">
    <ReactMarkdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
      {content}
    </ReactMarkdown>
  </div>
);
