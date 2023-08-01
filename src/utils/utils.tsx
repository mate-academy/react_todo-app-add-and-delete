export function getId<T extends { id: number }>(arr: T[]): number {
  let id = 1;

  if (arr.length > 0 && arr) {
    id = Math.max(...arr.map(el => el.id)) + 1;
  }

  return id;
}
