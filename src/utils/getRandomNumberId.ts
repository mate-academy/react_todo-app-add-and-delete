export function getRandomNumberId(length = 8): number {
  let randomId = 0;

  for (let i = 0; i < length; i++) {
    randomId += Math.floor(Math.random() * 10);
  }

  return randomId;
}
