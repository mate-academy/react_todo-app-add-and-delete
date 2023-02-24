import { Error } from '../enums/Error';

export const handlerError = (isError: Error) => {
  switch (isError) {
    case Error.RESET:
      return '';
    case Error.ADD:
      return 'Unable to add a todo';
    case Error.REMOVE:
      return 'Unable to delete a todo';
    case Error.UPDATE:
      return 'Unable to delete a todo';
    case Error.TITLE:
      return 'Title can\'t be empty';
    case Error.DATA:
      return 'Data error';
    case Error.USER:
      return 'Check your USER_ID';
    case Error.UPLOAD:
      return 'Unable to upload a todos';

    default:
      return 'Something is wrong';
  }
};
