export const IssueStatus = {
  TODO:        0,
  IN_PROGRESS: 1,
  DONE:        2,
} as const;

export type IssueStatus = typeof IssueStatus[keyof typeof IssueStatus];

export const IssuePriority = {
  LOW:    0,
  MEDIUM: 1,
  HIGH:   2,
} as const;

export type IssuePriority = typeof IssuePriority[keyof typeof IssuePriority];

export const ISSUE_STATUS_COLS: { key: IssueStatus; label: string; color: string }[] = [
  { key: IssueStatus.TODO,        label: 'Todo',        color: 'issue-col-todo' },
  { key: IssueStatus.IN_PROGRESS, label: 'In Progress', color: 'issue-col-progress' },
  { key: IssueStatus.DONE,        label: 'Done',        color: 'issue-col-done' },
];

export const ISSUE_PRIORITY_LABELS: Record<IssuePriority, { label: string; cls: string }> = {
  [IssuePriority.LOW]:    { label: '低', cls: 'issue-priority-low' },
  [IssuePriority.MEDIUM]: { label: '中', cls: 'issue-priority-medium' },
  [IssuePriority.HIGH]:   { label: '高', cls: 'issue-priority-high' },
};

export const ISSUE_NEXT_STATUS: Record<IssueStatus, { status: IssueStatus; label: string }[]> = {
  [IssueStatus.TODO]:        [{ status: IssueStatus.IN_PROGRESS, label: '开始处理' }],
  [IssueStatus.IN_PROGRESS]: [{ status: IssueStatus.TODO, label: '退回 Todo' }, { status: IssueStatus.DONE, label: '标为完成' }],
  [IssueStatus.DONE]:        [{ status: IssueStatus.IN_PROGRESS, label: '重新处理' }],
};
