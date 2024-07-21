import React, { useContext, useEffect } from 'react';
import cn from 'classnames';

import { StateContext, DispatchContext } from '../store/TodoContext';
import { useErrorMessage } from './useErrorMessage';

import { ActionType } from '../types/Actions';

export const ErrorNotification: React.FC = () => {
  const { errorMessage } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleError = useErrorMessage();

  useEffect(() => {
    if (!errorMessage) {
      dispatch({ type: ActionType.SetIsInputFocused, payload: true });
    }
  }, [errorMessage, dispatch]);

  function handleErrorMessageClose() {
    handleError('');
    dispatch({ type: ActionType.SetIsInputFocused, payload: true });
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorMessageClose}
      />
      {errorMessage}
    </div>
  );
};
