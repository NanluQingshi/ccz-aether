export const PracticeStatus = {
  TODO:        'todo',
  IN_PROGRESS: 'in_progress',
  MASTERED:    'mastered',
} as const;

export type PracticeStatus = typeof PracticeStatus[keyof typeof PracticeStatus];

export type PracticeFilterStatus = 'all' | PracticeStatus;

export const PRACTICE_STATUS_CONFIG: Record<PracticeStatus, { label: string; className: string }> = {
  [PracticeStatus.TODO]:        { label: '待学习', className: 'status-todo' },
  [PracticeStatus.IN_PROGRESS]: { label: '学习中', className: 'status-in-progress' },
  [PracticeStatus.MASTERED]:    { label: '已掌握', className: 'status-mastered' },
};

export const PRACTICE_FILTER_OPTIONS: { key: PracticeFilterStatus; label: string }[] = [
  { key: 'all',                    label: '全部' },
  { key: PracticeStatus.TODO,        label: PRACTICE_STATUS_CONFIG[PracticeStatus.TODO].label },
  { key: PracticeStatus.IN_PROGRESS, label: PRACTICE_STATUS_CONFIG[PracticeStatus.IN_PROGRESS].label },
  { key: PracticeStatus.MASTERED,    label: PRACTICE_STATUS_CONFIG[PracticeStatus.MASTERED].label },
];
