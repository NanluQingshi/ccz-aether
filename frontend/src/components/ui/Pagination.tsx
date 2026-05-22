import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = React.memo<PaginationProps>(({ page, pages, onPageChange }) => {
  const [jumpValue, setJumpValue] = useState('');

  if (pages <= 1) return null;

  const handleJump = () => {
    const target = parseInt(jumpValue, 10);
    if (!isNaN(target) && target >= 1 && target <= pages && target !== page) {
      onPageChange(target);
    }
    setJumpValue('');
  };

  return (
    <nav className="pagination" aria-label="分页导航">
      <button className="pagination-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={15} /> 上一页
      </button>
      <span className="pagination-info" aria-current="page" aria-label={`第 ${page} 页，共 ${pages} 页`}>
        {page} / {pages}
      </span>
      {pages > 2 && (
        <span className="pagination-jump">
          <input
            type="number"
            className="pagination-jump-input"
            min={1}
            max={pages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJump()}
            onBlur={handleJump}
            aria-label="跳转到指定页"
            placeholder="跳页"
          />
        </span>
      )}
      <button className="pagination-btn" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
        下一页 <ChevronRight size={15} />
      </button>
    </nav>
  );
});
