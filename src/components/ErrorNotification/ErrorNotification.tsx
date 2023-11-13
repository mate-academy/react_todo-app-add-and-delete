import { useEffect, useState } from 'react';
import { ErrorType } from '../../types/errorType';

interface ErrorNotificationProps {
  errorType: ErrorType | null;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = (
  { errorType },
) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);

    if (errorType) {
      const timerId = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timerId);
    }

    return () => { };
  }, [errorType]);

  const handleHideError = () => {
    setVisible(false);
  };

  const getErrorMessage = () => {
    switch (errorType) {
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
    visible && errorType ? (
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
