/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useContext, useMemo } from 'react';
import { ErrorType } from '../types/ErrorType';
import { TodoContext } from './TodoContext';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useContext(TodoContext);

  const errorMsg = useMemo(() => {
    switch (error) {
      case ErrorType.LoadError:
        return 'Unable to load todos';
      case ErrorType.EmptyTitle:
        return 'Title should not be empty';
      case ErrorType.AddTodoError:
        return 'Unable to add a todo';
      case ErrorType.DeleteTodoError:
        return 'Unable to delete a todo';
      case ErrorType.UpdateTodoError:
        return 'Unable to update a todo';
      default:
        return ErrorType.None;
    }
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === ErrorType.None },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorType.None)}
      />
      {errorMsg}
    </div>
  );
};
