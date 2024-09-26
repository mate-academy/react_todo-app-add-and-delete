import React, { useContext } from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from '../managment/TodoContext';

export const Error: React.FC = () => {
  const { errorMessage } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const closeMessageError = () => {
    dispatch({ type: 'errorMessage', payload: '' });
  };

  if (errorMessage) {
    setTimeout(() => {
      dispatch({
        type: 'errorMessage',
        payload: '',
      });
    }, 3000);
  }

  return (
    <div
      hidden={!errorMessage}
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="close error message"
        onClick={closeMessageError}
      />
      {errorMessage}
    </div>
  );
};
