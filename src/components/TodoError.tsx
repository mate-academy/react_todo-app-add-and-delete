import { useContext } from 'react';
import cn from 'classnames';

import { TodoContext } from '../contexts/TodoContext';
import { TodoError } from '../enums/TodoError';

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
      >
        {error}
      </button>
    </div>
  );
};
