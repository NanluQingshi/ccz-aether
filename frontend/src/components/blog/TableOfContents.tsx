import React, { useEffect, useMemo, useState } from 'react';

interface Heading {
  level: number;
  text: string;
  id: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.startsWith('```')) { inCodeBlock = !inCodeBlock; continue; }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2]
        .trim()
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1');
      headings.push({ level, text, id: slugify(text) });
    }
  }
  return headings;
}

interface Props {
  content: string;
}

export const TableOfContents: React.FC<Props> = ({ content }) => {
  const headings = useMemo(() => parseHeadings(content), [content]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const offset = 88;
      let current = headings[0]?.id ?? '';

      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY - offset <= window.scrollY) {
          current = id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="toc" aria-label="文章目录">
      <p className="toc-title">目录</p>
      <ul className="toc-list">
        {headings.map(({ level, text, id }) => (
          <li key={id} className={`toc-item toc-h${level}${activeId === id ? ' active' : ''}`}>
            <a
              href={`#${id}`}
              className="toc-link"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
                setActiveId(id);
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
