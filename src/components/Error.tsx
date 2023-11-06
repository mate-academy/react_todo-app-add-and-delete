/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';

import { useContext } from 'react';
import { TodoContext } from '../providers/TodoProvider';
import { TodoError } from '../types/TodoError';

export const Error: React.FC = () => {
  const { error, setError } = useContext(TodoContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: error === TodoError.Null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(TodoError.Null)}
      />

      {error}
    </div>
  );
};
