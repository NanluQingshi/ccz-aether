export const RoadmapStatus = {
  PLANNED: 'planned',
  DONE:    'done',
} as const;

export type RoadmapStatus = typeof RoadmapStatus[keyof typeof RoadmapStatus];

export const RoadmapPriority = {
  HIGH:   'high',
  MEDIUM: 'medium',
  LOW:    'low',
} as const;

export type RoadmapPriority = typeof RoadmapPriority[keyof typeof RoadmapPriority];

export const ROADMAP_PRIORITY_CONFIG: Record<RoadmapPriority, { label: string; className: string }> = {
  [RoadmapPriority.HIGH]:   { label: '高', className: 'priority-high' },
  [RoadmapPriority.MEDIUM]: { label: '中', className: 'priority-medium' },
  [RoadmapPriority.LOW]:    { label: '低', className: 'priority-low' },
};

export const ROADMAP_PRIORITY_ORDER: Record<RoadmapPriority, number> = {
  [RoadmapPriority.HIGH]:   0,
  [RoadmapPriority.MEDIUM]: 1,
  [RoadmapPriority.LOW]:    2,
};
