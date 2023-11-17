import React, { useEffect, useState } from 'react';
import { ErrorType } from '../types/ErrorType';

type Props = {
  error: ErrorType | null;
};

export const TodoErrors: React.FC<Props> = ({ error }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (error) {
      const timerId = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timerId);
    }

    return () => { };
  }, [error]);

  const handleHideError = () => {
    setVisible(false);
  };

  const getErrorMessage = () => {
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
        return null;
    }
  };

  return (
    visible && error ? (
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="Hide error"
          onClick={handleHideError}
        />
        {getErrorMessage()}
        <br />
      </div>
    ) : null
  );
};
