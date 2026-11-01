# Requirements Document

## Introduction

Dead Week is a spooky Halloween-themed study planner web app built with React and Vite. Users manage their exam preparation by adding subjects with exam dates and lists of topics. Each subject is represented as a tombstone in a dark graveyard UI. A "curse level" (0–100) computed from days remaining until the exam and the percentage of unstudied topics drives visual changes to the tombstone. Marking topics as studied lowers the curse level. All data is persisted in localStorage with no backend required.

## Glossary

- **App**: The Dead Week React + Vite single-page application.
- **Subject**: A study unit with a name, exam date, and a list of topics.
- **Topic**: An individual study item belonging to a Subject, which can be marked as studied or unstudied.
- **Curse_Level**: A numeric value between 0 and 100 (inclusive) representing how urgently a Subject needs attention, derived from days until the exam and the percentage of unstudied topics.
- **Tombstone**: The visual card component that represents a single Subject in the graveyard UI.
- **Graveyard**: The main view of the App displaying all Tombstones.
- **LocalStorage**: The browser's localStorage API used to persist all Subject and Topic data.

## Requirements

### Requirement 1: Subject Management

**User Story:** As a student, I want to add and remove subjects with an exam date and a list of topics, so that I can track everything I need to study before dead week.

#### Acceptance Criteria

1. THE App SHALL provide a form for creating a new Subject with a name (1–100 characters), an exam date (any valid calendar date), and at least one Topic (each Topic name 1–100 characters), with a maximum of 20 Topics per Subject.
2. WHEN a user submits a valid new Subject form, THE App SHALL add the Subject to the Graveyard and persist it to LocalStorage.
3. IF a user submits the Subject form with an empty Subject name, an invalid or missing exam date, an empty Topic name, or no Topics, THEN THE App SHALL display a validation error message adjacent to each offending field and not create the Subject.
4. WHEN a user deletes a Subject, THE App SHALL remove the Subject and all its Topics from the Graveyard and from LocalStorage.
5. WHEN the App loads, THE App SHALL display all persisted Subjects as Tombstones in the Graveyard.

### Requirement 2: Topic Management

**User Story:** As a student, I want to mark individual topics as studied, so that I can track my progress and reduce the curse level of a subject.

#### Acceptance Criteria

1. THE App SHALL display all Topics for a Subject within its Tombstone.
2. WHEN a user marks a Topic as studied, THE App SHALL update the Topic's studied state to true and persist the change to LocalStorage.
3. WHEN a user unmarks a Topic as studied, THE App SHALL update the Topic's studied state to false and persist the change to LocalStorage.
4. WHEN a user submits a new Topic name for an existing Subject, THE App SHALL add the Topic with a studied state of false and persist the addition to LocalStorage, provided the name is between 1 and 100 characters and does not already exist in that Subject.
5. IF a user submits a new Topic name that is empty or exceeds 100 characters or already exists in the Subject, THEN THE App SHALL reject the addition and display an error message indicating the reason without modifying LocalStorage.
6. WHEN a user removes a Topic from an existing Subject, THE App SHALL delete the Topic and persist the removal to LocalStorage.
7. WHEN a Topic's studied state changes or a Topic is removed, THE App SHALL recalculate and update the curse level of the affected Subject.

### Requirement 3: Curse Level Calculation

**User Story:** As a student, I want the curse level to reflect how urgently I need to study, so that I can prioritize subjects that need the most attention.

#### Acceptance Criteria

1. THE Curse_Level SHALL be an integer between 0 and 100 inclusive.
2. WHEN the exam date is today or in the past and at least one Topic is unstudied, THE App SHALL set the Curse_Level to 100.
3. WHEN all Topics in a Subject are marked as studied, THE App SHALL set the Curse_Level to 0 regardless of the exam date.
4. THE App SHALL compute the Curse_Level as the rounded result of: `(unstudied_topics / total_topics) * 50 + clamp((30 - days_remaining) / 30, 0, 1) * 50`, where days_remaining is the number of calendar days from today to the exam date, clamp(x, 0, 1) returns 0 if x < 0 and 1 if x > 1, and the result is rounded to the nearest integer.
5. WHEN a Topic's studied state changes, THE App SHALL recompute and display the updated Curse_Level for that Subject within 1 second.
6. WHEN the exam date of a Subject changes, THE App SHALL recompute and display the updated Curse_Level for that Subject within 1 second.
7. IF a Subject has no Topics, THEN THE App SHALL set its Curse_Level to 0.

### Requirement 4: Tombstone Visual States

**User Story:** As a student, I want the tombstone to change appearance based on curse level, so that I can immediately see how urgent each subject is at a glance.

#### Acceptance Criteria

1. WHEN the Curse_Level of a Subject is between 0 and 25 inclusive, THE Tombstone SHALL display in the calm visual state with no animation and no glow or distortion effects applied.
2. WHEN the Curse_Level of a Subject is between 26 and 50 inclusive, THE Tombstone SHALL display in the flickering visual state with a repeating opacity or brightness animation cycling at a rate between 1 and 3 times per second.
3. WHEN the Curse_Level of a Subject is between 51 and 75 inclusive, THE Tombstone SHALL display in the cracked visual state with a cracked-texture visual overlay applied and no motion animation.
4. WHEN the Curse_Level of a Subject is between 76 and 100 inclusive, THE Tombstone SHALL display in the haunted visual state with a continuous glow effect and a repeating shake or distortion animation cycling at a rate between 2 and 5 times per second.
5. THE App SHALL display the numeric Curse_Level value on each Tombstone in a position that remains readable across all four visual states.
6. WHEN the Curse_Level of a Subject changes to a value in a different visual state range, THE Tombstone SHALL update to the corresponding visual state without requiring a page reload.

### Requirement 5: Data Persistence

**User Story:** As a student, I want my subjects and progress to be saved automatically, so that I don't lose my data when I close or refresh the browser.

#### Acceptance Criteria

1. WHEN a Subject or Topic is created, updated, or deleted, THE App SHALL write the current state of all Subjects and Topics — including their names and each Topic's studied status — to LocalStorage before the next user interaction is processed.
2. WHEN the App is loaded or refreshed, THE App SHALL read all Subject and Topic data from LocalStorage and restore the Graveyard, including each Subject's name and exam date and each Topic's name and studied status, to the values present at the last successful save.
3. IF LocalStorage contains no data on load, THEN THE App SHALL display an empty Graveyard with a visible text message prompting the user to add their first Subject.
4. IF a write to LocalStorage fails, THEN THE App SHALL display an error message indicating that the data could not be saved and that the user's changes may not persist after a refresh.

### Requirement 6: Responsive Halloween UI

**User Story:** As a student, I want a dark, atmospheric graveyard interface that works on any device, so that the app is both usable and immersive.

#### Acceptance Criteria

1. THE App SHALL apply a dark color scheme using deep purples and blacks as background colors and visually distinct accent colors for interactive and highlighted elements, such that background and accent colors maintain a contrast ratio of at least 3:1.
2. THE App SHALL use a decorative serif or display font for all heading elements and a sans-serif or legible serif font at a minimum size of 16px for all body text.
3. WHEN the viewport width is 640px or greater, THE App SHALL render the Graveyard layout as a multi-column grid of at least 2 columns.
4. IF the viewport width is below 640px, THEN THE App SHALL collapse the Graveyard layout to a single-column stack.
5. THE Tombstone components SHALL apply a distinct visual treatment per state: calm displays a static, unlit appearance; flickering applies a repeating opacity or brightness animation; cracked displays a visible fracture overlay; haunted displays both the fracture overlay and the repeating animation.
6. WHERE a device signals a reduced-motion preference, THE App SHALL disable all repeating or looping animations on Tombstone components, including those used for the flickering and haunted states.
