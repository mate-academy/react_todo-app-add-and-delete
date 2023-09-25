import { IError } from '../context/TodoError';

type TCallback = (callback: (prev: IError) => IError) => void;

export function waitToClose(delay: number, callback: TCallback) {
  return window.setTimeout(() => {
    callback(prev => ({
      ...prev,
      hasError: false,
    }));
  }, delay);
}
