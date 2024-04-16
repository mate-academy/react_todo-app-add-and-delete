import React, { useContext } from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from '../context/ContextReducer';

export const TodoAppError: React.FC = () => {
  const { showError } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn({
        'notification is-danger is-light has-text-weight-normal': showError,
        hidden: !showError,
      })}
    >
      {showError && (
        <button
          onClick={() => dispatch({ type: 'setError', error: '' })}
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />
      )}
      {showError}
    </div>
  );
};
