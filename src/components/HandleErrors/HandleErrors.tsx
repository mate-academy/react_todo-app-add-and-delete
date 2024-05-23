import classNames from 'classnames';
import React, { useEffect } from 'react';

interface Props {
  errorType: ErrorType | null;
  onClose: () => void;
}

export const errors = {
  load: {
    message: 'Unable to load todos',
  },
  empty: {
    message: 'Title should not be empty',
  },
  delete: {
    message: 'Unable to delete a todo',
  },
  add: {
    message: 'Unable to add a todo',
  },
  update: {
    message: 'Unable to update a todo',
  },
};

export type ErrorType = keyof typeof errors;

export const HandleErrors: React.FC<Props> = ({ errorType, onClose }) => {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 3000);
  }, [onClose]);

  const message = errorType ? errors[errorType].message : '';

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};