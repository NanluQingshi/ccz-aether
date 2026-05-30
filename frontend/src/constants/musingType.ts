export const MusingType = {
  IDEA: 'idea',
  TODO: 'todo',
} as const;

export type MusingType = typeof MusingType[keyof typeof MusingType];

export type MusingFilterType = 'all' | MusingType;

export const MUSING_FILTER_OPTIONS: { key: MusingFilterType; label: string }[] = [
  { key: 'all',           label: '全部' },
  { key: MusingType.IDEA, label: '随想' },
  { key: MusingType.TODO, label: 'Todo' },
];
