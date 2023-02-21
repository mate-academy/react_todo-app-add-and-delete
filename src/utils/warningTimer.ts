export const warningTimer = <T>(
  callback: (value: T) => void,
  value: T,
  delay: number,
) => {
  let timerId;

  clearTimeout(timerId);
  timerId = setTimeout(() => {
    callback(value);
  }, delay);
};
