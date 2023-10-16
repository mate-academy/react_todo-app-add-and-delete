import { ErrorMessage } from './ErrorMessage';

export type ErrorState = [
  errorMessage: ErrorMessage,
  setErrorMessage: (errorMessage: ErrorMessage) => void,
];
