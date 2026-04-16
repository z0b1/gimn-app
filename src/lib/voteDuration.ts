export const MIN_VOTE_DURATION_MINUTES = 1;
export const MAX_VOTE_DURATION_MINUTES = 43200; // 30 dana
export const DEFAULT_VOTE_DURATION_MINUTES = 10080; // 7 dana
const ACTIVE_STATUS_PREFIX = "ACTIVE";
const ACTIVE_DURATION_MARKER = "|VDM=";

export const VOTE_DURATION_UNIT_TO_MINUTES = {
  minutes: 1,
  hours: 60,
  days: 1440,
} as const;

export type VoteDurationUnit = keyof typeof VOTE_DURATION_UNIT_TO_MINUTES;

export function isVoteDurationUnit(value: string): value is VoteDurationUnit {
  return value === "minutes" || value === "hours" || value === "days";
}

export function formatVoteDuration(minutes: number): string {
  if (minutes % 1440 === 0) {
    const days = minutes / 1440;
    return `${days} ${days === 1 ? "dan" : "dana"}`;
  }

  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} ${hours === 1 ? "sat" : "sati"}`;
  }

  return `${minutes} ${minutes === 1 ? "minut" : "minuta"}`;
}

export function buildActiveRuleStatus(minutes: number): string {
  return `${ACTIVE_STATUS_PREFIX}${ACTIVE_DURATION_MARKER}${minutes}`;
}

export function isActiveRuleStatus(status: string): boolean {
  return status === ACTIVE_STATUS_PREFIX || status.startsWith(`${ACTIVE_STATUS_PREFIX}${ACTIVE_DURATION_MARKER}`);
}

export function getVoteDurationMinutesFromStatus(status: string): number {
  if (!status.startsWith(`${ACTIVE_STATUS_PREFIX}${ACTIVE_DURATION_MARKER}`)) {
    return DEFAULT_VOTE_DURATION_MINUTES;
  }

  const rawMinutes = status.slice(`${ACTIVE_STATUS_PREFIX}${ACTIVE_DURATION_MARKER}`.length);
  const parsedMinutes = Number(rawMinutes);
  if (!Number.isInteger(parsedMinutes)) {
    return DEFAULT_VOTE_DURATION_MINUTES;
  }

  if (parsedMinutes < MIN_VOTE_DURATION_MINUTES || parsedMinutes > MAX_VOTE_DURATION_MINUTES) {
    return DEFAULT_VOTE_DURATION_MINUTES;
  }

  return parsedMinutes;
}
