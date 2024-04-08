import { Errors } from '../types/Errors';

export const DELAY_ERROR_HIDE = 3000;

export const hideError = (callback: (v: Errors) => void) => {
  return setTimeout(() => callback(Errors.NoError), DELAY_ERROR_HIDE);
};
