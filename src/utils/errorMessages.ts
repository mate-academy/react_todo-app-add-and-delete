import {
  UNEXPECTED_ERROR_PREFIX,
  UnexpectedErrorMessage,
} from '../types/ErrorMessages';

export function createUnexpectedErrorMessage(
  message: string,
): UnexpectedErrorMessage {
  return `${UNEXPECTED_ERROR_PREFIX} ${message}`;
}
