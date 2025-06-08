export function getFormattedSentences(rawSentences: string): string[] {
  return rawSentences
    .split('\n') // Transform to an array
    .map((s) => s.trim()) // Clean the array.
    .filter((s) => s.length > 0); // Remove whitespaces.
}
