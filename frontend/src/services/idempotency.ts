export function createAttemptKey(prefix: string, referenceId: string): string {
  return `${prefix}-${referenceId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function currentEpochMs(): number {
  return Date.now();
}
