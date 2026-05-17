import React, { useEffect, useRef, useState } from 'react';

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
}

interface Props<T extends string | number = string> {
  value: T;
  onChange: (val: T) => void;
  options: SelectOption<T>[];
  className?: string;
}

export function CustomSelect<T extends string | number = string>({
  value, onChange, options, className = '',
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`custom-select ${open ? 'open' : ''} ${className}`}>
      <button type="button" className="custom-select-trigger" onClick={() => setOpen((v) => !v)}>
        <span>{current?.label ?? ''}</span>
        <span className="custom-select-arrow">▾</span>
      </button>
      {open && (
        <div className="custom-select-dropdown">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`custom-select-option ${opt.value === value ? 'active' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
