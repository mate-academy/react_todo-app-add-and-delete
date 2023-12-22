import React from 'react';
import classNames from 'classnames';
import { Errors } from '../../types/Errors';

interface Props {
  error: Errors | null;
  onClose: () => void;
}

export const ErrorNotify: React.FC<Props> = ({
  error,
  onClose,
}) => {
  return (
    (
      <div
        data-cy="ErrorNotification"
        className={
          classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !error },
          )
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="delete todo"
          onClick={onClose}
        />
        {error}
        <br />
      </div>
    )
  );
};
