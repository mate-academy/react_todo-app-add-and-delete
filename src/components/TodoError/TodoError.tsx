import React, { useEffect, useContext } from 'react';
import cn from 'classnames';

import { TodosContext } from '../TodosContext';

export const TodoError: React.FC = () => {
  const { todoError, setTodoError } = useContext(TodosContext);

  useEffect(() => {
    setTimeout(() => {
      setTodoError(null);
    }, 3000);
  }, [todoError, setTodoError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !todoError },
      )}
    >
      <button
        aria-label="none"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setTodoError(null)}
      />
      {todoError}
    </div>
  );
};
