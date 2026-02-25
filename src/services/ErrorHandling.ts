import { ErrorType } from '../types/Error';

let timerID: ReturnType<typeof setTimeout> | undefined = undefined;

export function handleError(
  callback: (value: ErrorType | null) => void,
  errorType: ErrorType | null,
) {
  if (errorType !== null) {
    clearTimeout(timerID);
    timerID = undefined;
  }

  if (errorType !== null) {
    timerID = setTimeout(() => {
      callback(null);
    }, 3000);
  }

  callback(errorType);
}
