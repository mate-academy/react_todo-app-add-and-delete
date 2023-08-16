import { ErrorMessageActions, Types } from '../../reducer';

export const setErrorMessageAction = (message = ''):ErrorMessageActions => {
  return {
    type: Types.SetErrorMessage,
    payload: {
      errorMessage: message,
    },
  };
};
