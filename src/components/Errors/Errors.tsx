import cn from 'classnames';
import { useContext, useEffect } from 'react';
import { TodosContext } from '../TodosProvider';

export const Errors: React.FC = () => {
  const { todosError, setTodosError }
    = useContext(TodosContext);

  const timeoutId = setTimeout(() => {
    setTodosError('');
  }, 3000);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !todosError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setTodosError('')}
        aria-label="HideErrorButton"
      />
      {/* show only one message at a time */}
      {todosError}
    </div>
  );
};
