/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { ErrorType } from '../types/ErrorType';

type Props = {
  error: ErrorType | null;
};

export const Error: React.FC<Props> = ({ error }) => {
  const [isErrorMessage, setIsErrorMessage] = useState(true);

  const getErrorMessage = () => {
    switch (error) {
      case ErrorType.LoadError:
        return 'Unable to load todos';

      case ErrorType.TitleError:
        return 'Title should not be empty';

      case ErrorType.AddError:
        return 'Unable to add a todo';

      case ErrorType.DeleteError:
        return 'Unable to delete a todo';

      case ErrorType.UpdateError:
        return 'Unable to update a todo';

      default:
        return null;
    }
  };

  const handleHideMessage = () => {
    setIsErrorMessage(false);
  };

  return (
    isErrorMessage && error ? (
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"

      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleHideMessage}
          aria-label="Close message"
        />
        {getErrorMessage()}
      </div>
    ) : null
  );
};
