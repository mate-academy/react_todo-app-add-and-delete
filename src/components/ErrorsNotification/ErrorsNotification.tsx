import React, { useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorType: ErrorType;
};

export const ErrorsNotification: React.FC<Props> = ({ errorType }) => {
  const [hasError, setHasError] = useState<boolean>(true);

  const handleCloseButtonClick = () => {
    setHasError(false);
  };

  let errorMessage = '';

  switch (errorType) {
    case ErrorType.NONE:
      break;
    case ErrorType.LOAD:
      errorMessage = 'Server is unavailable';
      break;
    case ErrorType.EMPTY_TITLE:
      errorMessage = 'Title can\'t be empty';
      break;
    case ErrorType.ADD:
      errorMessage = 'Unable to add a todo';
      break;
    case ErrorType.DELETE:
      errorMessage = 'Unable to delete a todo';
      break;

    default:
      errorMessage = 'Unknown error!';
      break;
  }

  return (
    /* Notification is shown in case of any error */
    /* Add the 'hidden' class to hide the message smoothly */
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={handleCloseButtonClick}
      />
      {errorMessage}
    </div>
  );
};

// {/* show only one message at a time */}
// Unable to add a todo
// <br />
// Unable to delete a todo
// <br />
// Unable to update a todo
