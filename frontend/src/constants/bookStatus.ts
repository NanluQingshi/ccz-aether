export const BookStatus = {
  WANT:    'want',
  READING: 'reading',
  DONE:    'done',
} as const;

export type BookStatus = typeof BookStatus[keyof typeof BookStatus];

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  [BookStatus.WANT]:    '想读',
  [BookStatus.READING]: '在读',
  [BookStatus.DONE]:    '已读',
};

export const BOOK_STATUS_ORDER: Record<BookStatus, number> = {
  [BookStatus.READING]: 0,
  [BookStatus.WANT]:    1,
  [BookStatus.DONE]:    2,
};

export const BOOK_STATUS_TABS: { key: BookStatus; label: string }[] = [
  { key: BookStatus.READING, label: BOOK_STATUS_LABELS[BookStatus.READING] },
  { key: BookStatus.WANT,    label: BOOK_STATUS_LABELS[BookStatus.WANT] },
  { key: BookStatus.DONE,    label: BOOK_STATUS_LABELS[BookStatus.DONE] },
];
