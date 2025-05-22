export interface PendingProgress {
  actual: number;
  date: Date;
}

export interface Progress extends PendingProgress {
  goal: number;
}