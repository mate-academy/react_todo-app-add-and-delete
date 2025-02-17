// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (callBack: Function, delay: number) => {
  let timer = 0;

  return (...args: unknown[]) => {
    window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      callBack(args);
    }, delay);
  };
};
