export function getActiveItems<T extends { completed: boolean }>(items: T[]) {
  return items.filter(item => !item.completed).length;
}

export function getCompletedItems<T extends { completed: boolean; id: number }>(
  items: T[],
) {
  return items.filter(item => item.completed).map(item => item.id);
}
