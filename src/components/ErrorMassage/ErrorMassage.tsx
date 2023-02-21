import React, { useEffect } from 'react';

import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorMassage: ErrorType,
  onErrorClose: () => void,
  isError: boolean,
};

export const ErrorMessage: React.FC<Props> = ({
  errorMassage,
  onErrorClose,
  isError,
}) => {
  let massage = '';
  const errorUpload = 'Unable to upload todos';
  const errorAdd = 'Unable to add a todo';
  const errorDelete = 'Unable to delete a todo';
  const errorUpdate = 'Unable to update a todo';
  const errorTittle = 'Title can/\'t be empty';

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        onErrorClose();
        clearTimeout(timer);
      }, 3000);
    }
  }, [isError]);

  switch (errorMassage) {
    case ErrorType.UPLOAD_ERROR:
      massage = errorUpload;
      break;

    case (ErrorType.ADD_ERROR):
      massage = errorAdd;
      break;

    case (ErrorType.DELETE_ERROR):
      massage = errorDelete;
      break;

    case (ErrorType.UPDATE_ERROR):
      massage = errorUpdate;
      break;

    case (ErrorType.TITLE_ERROR):
      massage = errorTittle;
      break;

    case (ErrorType.NONE):
      break;

    default:
      throw new Error('Unexpected error type');
  }

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !isError },
    )}
    >
      <button
        aria-label="delete error massage"
        type="button"
        className="delete"
        onClick={onErrorClose}
      />

      {massage}
    </div>
  );
};
