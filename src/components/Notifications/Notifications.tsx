import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  errorType: ErrorTypes,
};
export const Notifications: React.FC<Props> = React.memo((
  {
    errorType,
  },
) => {
  const [isHidden, setIsHidden] = useState(true);
  let errorMessage = '';

  const closeNotification = () => {
    const timeOutId = window.setTimeout(() => {
      setIsHidden(true);
      window.clearTimeout(timeOutId);
    }, 3000);
  };

  useEffect(() => {
    if (errorType !== ErrorTypes.NONE) {
      setIsHidden(false);
      closeNotification();
    } else {
      setIsHidden(true);
    }
  }, [errorType]);

  switch (errorType) {
    case ErrorTypes.NONE:
      break;
    case ErrorTypes.EMPTY_TITLE:
      errorMessage = 'Title can\'t be empty';
      break;

    case ErrorTypes.ADD_ERROR:
      errorMessage = 'Unable to add a todo';
      break;

    case ErrorTypes.UPLOAD_ERROR:
      errorMessage = 'Unable to upload todos';
      break;

    case ErrorTypes.UPDATE_ERROR:
      errorMessage = 'Unable to update a todo';
      break;

    case ErrorTypes.DELETE_ERROR:
      errorMessage = 'Unable to delete a todo';
      break;

    default:
      throw new Error('Unexpected type of error');
  }

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isHidden,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => {
          setIsHidden(true);
        }}
      />
      {errorMessage}
    </div>
  );
});
