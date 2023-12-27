import { Dispatch } from 'react';
import { Actions, ErrorMessages } from '../enums';
import { Action } from '../types';

type SetErrorMessageType = (
  dispatch: Dispatch<Action>,
  errorMessage: ErrorMessages
) => void;

export const setErrorMessage: SetErrorMessageType = (
  dispatch,
  errorMessage,
) => {
  dispatch({
    type: Actions.setErrorMessage,
    payload: { errorMessage },
  });
};
