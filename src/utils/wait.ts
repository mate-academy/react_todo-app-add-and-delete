// returns a promise resolved after a given delay

export function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}
