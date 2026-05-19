import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      <button className="pagination-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={15} /> 上一页
      </button>
      <span className="pagination-info">{page} / {pages}</span>
      <button className="pagination-btn" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
        下一页 <ChevronRight size={15} />
      </button>
    </div>
  );
};
