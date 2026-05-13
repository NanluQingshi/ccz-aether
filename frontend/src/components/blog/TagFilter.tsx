import React from 'react';
import type { TagVO } from '../../types/tag';

interface TagFilterProps {
  tags: TagVO[];
  activeSlug?: string;
  onSelect: (slug: string | undefined) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ tags, activeSlug, onSelect }) => (
  <div className="filter-group">
    <span className="filter-label">标签</span>
    <div className="filter-chips">
      <button
        className={`filter-chip ${!activeSlug ? 'active' : ''}`}
        onClick={() => onSelect(undefined)}
      >
        全部
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          className={`filter-chip ${activeSlug === tag.slug ? 'active' : ''}`}
          onClick={() => onSelect(tag.slug)}
        >
          {tag.name}
          {tag.postCount !== undefined && (
            <span className="filter-count">{tag.postCount}</span>
          )}
        </button>
      ))}
    </div>
  </div>
);
