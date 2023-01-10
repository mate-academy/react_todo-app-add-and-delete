import classNames from 'classnames';
import React from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorType: ErrorType;
  hasError: boolean;
  setHasError: (value: boolean) => void;
};

export const Error: React.FC<Props> = ({
  errorType,
  hasError,
  setHasError,
}) => {
  const errorNotification = (ifError: ErrorType) => {
    switch (ifError) {
      case ErrorType.add:
        return 'Unable to add a todo';

      case ErrorType.update:
        return 'Unable to update a todo';

      case ErrorType.delete:
        return 'Unable to delete a todo';

      case ErrorType.empty:
        return 'Title can\'t be empty';

      default:
        return 'Error';
    }
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHasError(false)}
      />
      {errorNotification(errorType)}
    </div>
  );
};
