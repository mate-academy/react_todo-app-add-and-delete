import { ErrorSpec } from '../types/ErrorSpec';

export const ErrorText = (error: ErrorSpec | null) => {
  switch (error) {
    case ErrorSpec.NOT_LOADED: {
      return 'Unable to load todos';
    }

    case ErrorSpec.EMPTY_TITLE: {
      return 'Title should not be empty';
    }

    case ErrorSpec.NOT_ADDED: {
      return 'Unable to add a todo';
    }

    case ErrorSpec.NOT_DELETED: {
      return 'Unable to delete a todo';
    }

    case ErrorSpec.NOT_UPDATED: {
      return 'Unable to update a todo';
    }

    default: {
      return '';
    }
  }
};
