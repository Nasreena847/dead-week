import { describe, it, expect } from 'vitest';
import { getTombstoneState } from './getTombstoneState';

describe('getTombstoneState', () => {
  // calm: 0–25
  it('returns calm for curseLevel 0', () => {
    expect(getTombstoneState(0)).toBe('calm');
  });

  it('returns calm for curseLevel 25', () => {
    expect(getTombstoneState(25)).toBe('calm');
  });

  // flickering: 26–50
  it('returns flickering for curseLevel 26', () => {
    expect(getTombstoneState(26)).toBe('flickering');
  });

  it('returns flickering for curseLevel 50', () => {
    expect(getTombstoneState(50)).toBe('flickering');
  });

  // cracked: 51–75
  it('returns cracked for curseLevel 51', () => {
    expect(getTombstoneState(51)).toBe('cracked');
  });

  it('returns cracked for curseLevel 75', () => {
    expect(getTombstoneState(75)).toBe('cracked');
  });

  // haunted: 76–100
  it('returns haunted for curseLevel 76', () => {
    expect(getTombstoneState(76)).toBe('haunted');
  });

  it('returns haunted for curseLevel 100', () => {
    expect(getTombstoneState(100)).toBe('haunted');
  });
});
