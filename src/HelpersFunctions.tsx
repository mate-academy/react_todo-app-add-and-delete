export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function setSingleOrPluralWordByCount(
  word: string,
  count: number,
): string {
  return count > 1
    ? `${word}s`
    : word;
}
