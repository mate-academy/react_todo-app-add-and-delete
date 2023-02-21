import React, { useEffect } from 'react';

import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorMassage: ErrorType,
  closeError: () => void,
  isError: boolean,
};

export const ErrorMassage: React.FC<Props> = ({
  errorMassage,
  closeError,
  isError,
}) => {
  let massage = '';

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        closeError();
      }, 3000);
    }
  }, [isError]);

  switch (errorMassage) {
    case ErrorType.UPLOAD_ERROR:
      massage = ErrorType.UPLOAD_ERROR;
      break;

    case ErrorType.ADD_ERROR:
      massage = ErrorType.ADD_ERROR;
      break;

    case ErrorType.DELETE_ERROR:
      massage = ErrorType.DELETE_ERROR;
      break;

    case ErrorType.UPDATE_ERROR:
      massage = ErrorType.UPDATE_ERROR;
      break;

    case ErrorType.TITLE_ERROR:
      massage = ErrorType.TITLE_ERROR;
      break;

    case ErrorType.NONE:
      break;

    default:
      throw new Error('Unexpected error type');
  }

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !isError,
        },
      )}
    >
      <button
        aria-label="delete error"
        type="button"
        className="delete"
        onClick={closeError}
      />

      {massage}
    </div>
  );
};
