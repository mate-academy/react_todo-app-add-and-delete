import React from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType,
  setError: (value: ErrorType) => void,
};

export const ErrorMessage: React.FC<Props> = ({
  error,
  setError,
}) => {
  const errorMessage = () => {
    switch (error) {
      case 'add':
        return 'Unable to add a todo';

      case 'delete':
        return 'Unable to delete a todo';

      case 'update':
        return 'Unable to update a todo';

      case 'empty':
        return 'Title can\'t be empty';

      default:
        return null;
    }
  };

  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          aria-label="Close Error"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {errorMessage()}
      </div>
    </>
  );
};
