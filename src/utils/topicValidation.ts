/**
 * Validates a topic name before it is added to a subject.
 *
 * @param name - The proposed topic name.
 * @param existingNames - Names already in use for the subject (case-sensitive).
 * @returns A descriptive error string if invalid, or `null` when the name is acceptable.
 */
export function validateTopicName(
  name: string,
  existingNames: string[],
): string | null {
  if (name.length === 0) return 'Topic name cannot be empty.';
  if (name.trim().length === 0) return 'Topic name cannot be whitespace only.';
  if (name.length > 100) return 'Topic name cannot exceed 100 characters.';
  if (existingNames.includes(name)) return 'A topic with that name already exists.';
  return null;
}
