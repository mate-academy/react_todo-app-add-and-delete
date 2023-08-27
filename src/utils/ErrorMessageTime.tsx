import { ErrorMessage } from '../Enum/ErrorMessage';

export const setErrorMessageTime = (
  type: ErrorMessage,
  time: number,
  setIsError: (value: ErrorMessage) => void,
) => {
  setIsError(type);
  setTimeout(() => setIsError(type), time);
};
