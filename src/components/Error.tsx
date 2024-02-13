/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from './TodosContext';

export const Error: React.FC = () => {
  const { errorMessage, isError } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hideError = () => {
    dispatch({
      type: 'hideErrorMessage',
    });
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideError}
      />
      {errorMessage}
    </div>
  );
};
