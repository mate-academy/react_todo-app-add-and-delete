import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../enums/ErrorType';

type Props = {
  errorType: ErrorType;
  isErrorShown: boolean;
  onCloseErrorNotification: () => void;
};

const ErrorNotification:React.FC<Props> = React.memo(({
  errorType,
  isErrorShown,
  onCloseErrorNotification,
}) => {
  let errorMessage = '';

  switch (errorType) {
    case ErrorType.add:
    case ErrorType.delete:
    case ErrorType.update:
    case ErrorType.download:
      errorMessage = `Unable to ${errorType} a todo`;

      break;

    case ErrorType.emptyTitle:
      errorMessage = 'Title can\'t be empty';

      break;

    default:
      errorMessage = '';
  }

  useEffect(() => {
    const timerId = setTimeout(() => onCloseErrorNotification(), 3000);

    return () => clearTimeout(timerId);
  });

  return (
    <>
      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !isErrorShown },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={onCloseErrorNotification}
          aria-label="Close notification about an error"
        />
        {errorMessage}
      </div>
    </>
  );
});

export default ErrorNotification;
