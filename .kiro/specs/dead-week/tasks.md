# Implementation Plan: Dead Week

## Overview

Implement a single-page React + Vite Halloween-themed study planner. All state is persisted in `localStorage`. The build order moves from data types and pure logic, through the custom hook, then to components, styling, and finally tests.

## Tasks

- [x] 1. Scaffold project and define core types
  - [x] 1.1 Initialise a Vite + React + TypeScript project inside the workspace root and install runtime dependencies (`uuid`) and dev dependencies (`vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`, `fast-check`)
    - Configure `vitest` in `vite.config.ts` with `jsdom` environment and a `setupTests.ts` file
    - _Requirements: 1.1, 2.1, 5.1_
  - [x] 1.2 Create `src/types.ts` with the `Subject`, `Topic`, `SubjectDraft`, and `TombstoneState` TypeScript interfaces and the `STORAGE_KEY` constant
    - Export all types; no runtime logic in this file
    - _Requirements: 1.1, 3.1, 4.1_

- [x] 2. Implement pure utility functions
  - [x] 2.1 Create `src/utils/curseLevelFor.ts` implementing `curseLevelFor(subject: Subject): number`
    - Follow the formula exactly as specified: topic component + time component, clamped to [0, 100], rounded to integer
    - Handle edge cases: no topics → 0, all studied → 0, exam today or past with unstudied → 100
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7_
  - [ ]* 2.2 Write property tests for `curseLevelFor` (Property 1, 2, 3, 4)
    - **Property 1: Curse level is always in range** — generate arbitrary subjects; assert result is integer in [0, 100]
    - **Property 2: All-studied subjects have curse level 0** — generate subjects where every topic has `studied: true`; assert result is 0
    - **Property 3: Past-or-today exam with unstudied topics yields curse level 100** — generate subjects with exam date ≤ today and at least one unstudied topic; assert result is 100
    - **Property 4: No-topic subjects have curse level 0** — generate subjects with empty `topics` array; assert result is 0
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.7**
  - [ ]* 2.3 Write unit tests for `curseLevelFor`
    - Cover each visual-state boundary value: curse levels mapping to 0, 25, 26, 50, 51, 75, 76, 100
    - Cover: all-studied, no-topics, exam today, exam yesterday, exam tomorrow, 30 days out, 31 days out
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7_
  - [x] 2.4 Create `src/utils/getTombstoneState.ts` implementing `getTombstoneState(curseLevel: number): TombstoneState`
    - Boundaries: 0–25 → `calm`, 26–50 → `flickering`, 51–75 → `cracked`, 76–100 → `haunted`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ]* 2.5 Write unit tests for `getTombstoneState`
    - Assert boundary values 0, 25, 26, 50, 51, 75, 76, 100 map to the correct state
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 2.6 Create `src/utils/topicValidation.ts` exporting `validateTopicName(name: string, existingNames: string[]): string | null`
    - Returns a descriptive error string for: empty, whitespace-only, over-100-chars, duplicate; returns `null` when valid
    - _Requirements: 2.4, 2.5_
  - [ ]* 2.7 Write property tests for topic validation (Property 7)
    - **Property 7: Invalid topic names are rejected and leave the list unchanged** — generate invalid names (empty, whitespace, >100 chars, duplicate); assert `validateTopicName` returns a non-null error string
    - Generate valid names; assert `validateTopicName` returns `null`
    - **Validates: Requirements 2.4, 2.5**

- [x] 3. Checkpoint — pure logic
  - Ensure all pure-function tests pass before proceeding to the hook. Ask the user if questions arise.

- [x] 4. Implement `useSubjects` custom hook and localStorage layer
  - [x] 4.1 Create `src/hooks/useSubjects.ts` implementing `useSubjects(): UseSubjectsResult`
    - On mount, read and parse `"dead-week:subjects"` from `localStorage`; fall back to `[]` on parse failure
    - Implement `addSubject(draft: SubjectDraft)`: generate `uuid` ids for subject and each topic, compute initial curse level, append to state, write to `localStorage`
    - Implement `deleteSubject(id: string)`: filter subject out, write to `localStorage`
    - Implement `addTopic(subjectId, name)`: validate name via `validateTopicName`, return error string on failure, otherwise append topic, recompute curse level, write to `localStorage`
    - Implement `removeTopic(subjectId, topicId)`: filter topic out, recompute curse level, write to `localStorage`
    - Implement `toggleTopic(subjectId, topicId)`: flip `studied`, recompute curse level, write to `localStorage`
    - Wrap every `localStorage.setItem` call in a try/catch; surface `storageError: string | null` in the hook's return value
    - _Requirements: 1.2, 1.4, 2.2, 2.3, 2.4, 2.6, 2.7, 3.5, 3.6, 5.1, 5.2, 5.4_
  - [ ]* 4.2 Write property tests for `useSubjects` round-trip (Property 5, 6)
    - **Property 5: Adding a topic increases the subject's topic count by exactly 1** — generate subjects and valid topic names; after calling `addTopic` assert `topics.length` increased by exactly 1
    - **Property 6: LocalStorage round-trip preserves subjects** — generate arbitrary `Subject[]`; serialise to `localStorage` and re-initialise the hook; assert ids, names, exam dates, topic names, and studied states are structurally identical
    - **Validates: Requirements 2.4, 5.1, 5.2**
  - [ ]* 4.3 Write unit tests for `useSubjects`
    - `addSubject` happy path persists and appears in `subjects`
    - `deleteSubject` removes subject from state and `localStorage`
    - `addTopic` with invalid name returns error and does not modify state
    - `removeTopic` and `toggleTopic` recompute curse level
    - Corrupted `localStorage` content falls back to empty array
    - `localStorage.setItem` failure surfaces `storageError`
    - _Requirements: 1.2, 1.3, 1.4, 2.2, 2.3, 2.4, 2.5, 2.6, 5.1, 5.2, 5.3, 5.4_

- [x] 5. Checkpoint — hook and storage
  - Ensure all hook tests pass before proceeding to UI. Ask the user if questions arise.

- [x] 6. Build UI components (structure and logic)
  - [x] 6.1 Create `src/components/CurseLevelBadge.tsx`
    - Renders `curseLevel` as a visible number; no animation; sits outside any overlay layer
    - Props: `curseLevel: number`
    - _Requirements: 4.5_
  - [x] 6.2 Create `src/components/TopicItem.tsx`
    - Renders topic name, a checkbox (controlled by `topic.studied`) and a remove button
    - Props: `topic: Topic`, `onToggle(): void`, `onRemove(): void`
    - _Requirements: 2.1, 2.2, 2.3, 2.6_
  - [x] 6.3 Create `src/components/TopicList.tsx`
    - Renders an ordered list of `TopicItem` components
    - Props: `topics: Topic[]`, `onToggle(id: string): void`, `onRemove(id: string): void`
    - _Requirements: 2.1_
  - [x] 6.4 Create `src/components/AddTopicForm.tsx`
    - Inline form with a text input and submit button; validates via `validateTopicName` and displays inline error
    - Props: `existingTopics: string[]`, `onAdd(name: string): void`
    - _Requirements: 2.4, 2.5_
  - [x] 6.5 Create `src/components/Tombstone.tsx`
    - Renders subject name, exam date, `CurseLevelBadge`, `TopicList`, `AddTopicForm`, and a delete button
    - Applies a `data-state` attribute (or CSS class) derived from `getTombstoneState(subject.curseLevel)` for CSS targeting
    - Props: `subject: Subject`, `onDelete(): void`, `onAddTopic(name: string): void`, `onRemoveTopic(id: string): void`, `onToggleTopic(id: string): void`
    - _Requirements: 1.4, 2.1, 4.1–4.6_
  - [x] 6.6 Create `src/components/AddSubjectForm.tsx`
    - Controlled form; fields: subject name, exam date, initial topic list (allow adding/removing topics inline before submit)
    - Validates each field on submit and displays per-field error messages; resets on successful submit
    - Props: `onAdd(draft: SubjectDraft): void`
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 6.7 Create `src/components/Graveyard.tsx`
    - Renders a CSS grid of `Tombstone` components; shows empty-state message when `subjects` is empty
    - Props: `subjects: Subject[]`, `onDelete`, `onAddTopic`, `onRemoveTopic`, `onToggleTopic`
    - _Requirements: 1.5, 5.3, 6.3, 6.4_
  - [x] 6.8 Wire everything together in `src/App.tsx`
    - Call `useSubjects`; pass handlers and subjects to `AddSubjectForm` and `Graveyard`
    - Render `storageError` as a non-blocking banner when set
    - _Requirements: 1.2, 1.4, 5.4_

- [x] 7. Add Halloween CSS styling
  - [x] 7.1 Create `src/styles/global.css` with base dark theme
    - CSS custom properties for colour palette (deep purples, blacks, glowing accents)
    - Import a gothic/display web font (e.g. Google Fonts `Creepster` or `UnifrakturMaguntia`) for headings; use a system sans-serif for body text at minimum 16px
    - Ensure heading/accent contrast ratio ≥ 3:1 against backgrounds
    - _Requirements: 6.1, 6.2_
  - [x] 7.2 Create `src/styles/graveyard.css` with responsive grid layout
    - Single-column below 640 px; ≥ 2 columns at 640 px and above
    - _Requirements: 6.3, 6.4_
  - [x] 7.3 Create `src/styles/tombstone.css` with per-state visual treatments
    - `[data-state="calm"]`: static, unlit, no animation
    - `[data-state="flickering"]`: repeating opacity/brightness animation at 1–3 cycles per second
    - `[data-state="cracked"]`: cracked-texture overlay (CSS `::after` pseudo-element or SVG), no motion
    - `[data-state="haunted"]`: cracked overlay + continuous glow + repeating shake/distortion animation at 2–5 cycles per second
    - `@media (prefers-reduced-motion: reduce)` block disabling all looping animations on Tombstone
    - _Requirements: 4.1–4.4, 4.6, 6.5, 6.6_

- [x] 8. Checkpoint — visual polish
  - Run `vitest --run` to confirm all tests still pass after styling changes. Ask the user if questions arise.

- [ ]* 9. Write component integration tests
  - [ ]* 9.1 Write unit tests for `AddSubjectForm`
    - Submitting with empty name shows validation error and does not call `onAdd`
    - Submitting with no topics shows validation error and does not call `onAdd`
    - Submitting a valid form calls `onAdd` with correct draft and resets fields
    - _Requirements: 1.1, 1.3_
  - [ ]* 9.2 Write unit tests for `AddTopicForm`
    - Submitting an empty name shows inline error
    - Submitting a duplicate name shows inline error
    - Submitting a valid name calls `onAdd` and clears the input
    - _Requirements: 2.4, 2.5_
  - [ ]* 9.3 Write unit tests for `Tombstone`
    - Correct `data-state` attribute applied for each curse-level range
    - Delete button calls `onDelete`
    - Topic checkbox calls `onToggleTopic`
    - Topic remove button calls `onRemoveTopic`
    - _Requirements: 4.1–4.6_
  - [ ]* 9.4 Write unit tests for `Graveyard`
    - Empty `subjects` array renders empty-state message
    - Non-empty array renders one `Tombstone` per subject
    - _Requirements: 1.5, 5.3_

- [x] 10. Final checkpoint — all tests pass
  - Run `vitest --run`; ensure zero failures. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP build.
- Property tests use [fast-check](https://fast-check.io/) and run a minimum of 100 iterations each.
- Each property test task references its property number from `design.md` for traceability.
- The `curseLevelFor` function is the heart of the app; implement and test it before any UI work.
- All `localStorage` writes must be wrapped in try/catch per the error-handling spec.
- Animations must respect `prefers-reduced-motion`; implement this in the same CSS file as the animations (Task 7.3).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.4", "2.6"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.5", "2.7", "4.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "6.1", "6.2", "6.3", "6.4"] },
    { "id": 4, "tasks": ["6.5", "6.6"] },
    { "id": 5, "tasks": ["6.7"] },
    { "id": 6, "tasks": ["6.8", "7.1", "7.2", "7.3"] },
    { "id": 7, "tasks": ["9.1", "9.2", "9.3", "9.4"] }
  ]
}
```
