import classNames from 'classnames';
import React from 'react';
import { ErrorMessages } from '../../types/Todo';

interface Props {
  message: ErrorMessages | null;
  setError: (message: ErrorMessages | null) => void;
}

export const ErrorMessage: React.FC<Props> = ({ message, setError }) => (
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
      onClick={() => {
        setError(null);
      }}
    />
    {message}
  </div>
);
