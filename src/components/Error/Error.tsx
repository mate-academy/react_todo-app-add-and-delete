import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
  isErrorShown: boolean;
  onErrorClose: () => void;
};

export const Error: React.FC<Props> = ({
  errorMessage,
  isErrorShown,
  onErrorClose,
}) => {
  let errorString = '';

  switch (errorMessage) {
    case ErrorMessage.Add:
    case ErrorMessage.Download:
    case ErrorMessage.Delete:
    case ErrorMessage.Update:
      errorString = `Unable to ${errorMessage} a todo`;
      break;
    case ErrorMessage.EmptyTitle:
      errorString = 'Title can\'t be empty';
      break;
    default:
      errorString = '';
  }

  useEffect(() => {
    setTimeout(() => onErrorClose(), 3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isErrorShown,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={onErrorClose}
        aria-label="Close error message"
      />

      {errorString}
    </div>
  );
};
