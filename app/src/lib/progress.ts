export interface Evidence { attempts: number; correct: boolean; practiced: boolean; challenge: boolean }
export type Progress = Record<string, Evidence>
export const emptyEvidence: Evidence = { attempts: 0, correct: false, practiced: false, challenge: false }
export function mastery(evidence?: Evidence) {
  if (!evidence) return 'Not started'
  if (evidence.correct && evidence.practiced && evidence.challenge) return 'Mastered'
  if (evidence.correct) return 'Understood'
  if (evidence.practiced) return 'Practicing'
  if (evidence.attempts) return 'Learning'
  return 'Not started'
}
export function validateProgress(value: unknown): Progress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry && typeof entry === 'object' && Number.isInteger(entry.attempts) && entry.attempts >= 0 && ['correct', 'practiced', 'challenge'].every(key => typeof entry[key] === 'boolean')))
}
export function readLocal(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') } catch { return null }
}