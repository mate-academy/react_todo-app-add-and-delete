import { Errors } from '../types/Errors';

export function filterMessage(message: Errors) {
  switch (message) {
    case Errors.UPLOAD:
      return `Unable to ${message} todos`;

    case Errors.EMPTY:
      return 'Title can\'t be empty';

    default:
      return `Unable to ${message} a todo`;
  }
}
