/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext } from 'react';
import cn from 'classnames';

import { TodosContext } from '../TodoContext/TodoContext';
import { ErrorMessage } from '../../types/Error';

export const TodoError = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification',
        'is-danger', 'is-light', 'has-text-weight-normal', {
          hidden: errorMessage === ErrorMessage.None,
        })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.None)}
        aria-label="Clear error message"
      />
      {errorMessage}
    </div>
  );
};
