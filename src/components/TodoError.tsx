import { useCallback, useContext } from 'react';
import classNames from 'classnames';

import { TodoContext } from './TodoContext';

export const TodoError = () => {
  const { state, dispatch } = useContext(TodoContext);

  const hideError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', error: null });
  }, [dispatch]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !state.error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideError}
      />
      {state.error}
    </div>
  );
};
