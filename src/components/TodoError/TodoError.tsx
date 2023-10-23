/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  errorMessage: Error,
  onErrorChange: () => void
};

export const TodoError: React.FC<Props> = ({ errorMessage, onErrorChange }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onErrorChange}
      />
      {errorMessage}
    </div>
  );
};
