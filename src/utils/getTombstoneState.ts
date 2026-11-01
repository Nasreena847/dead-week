import type { TombstoneState } from '../types';

export function getTombstoneState(curseLevel: number): TombstoneState {
  if (curseLevel <= 25) return 'calm';
  if (curseLevel <= 50) return 'flickering';
  if (curseLevel <= 75) return 'cracked';
  return 'haunted';
}
