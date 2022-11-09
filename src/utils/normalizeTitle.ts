export const normalizeTitle = (title: string) => {
  return title
    .trim()
    .split(' ')
    .filter((words: string) => words !== '')
    .join(' ');
};
