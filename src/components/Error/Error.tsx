/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';

type Props = {
  errorMessage: string;
  onClose: (message: string) => void;
};

export const Error: React.FC<Props> = ({ errorMessage, onClose }) => {
  useEffect(() => {
    const timerId = setTimeout(() => onClose(''), 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={errorMessage === ''}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClose('')}
      />

      {errorMessage}
    </div>

  );
};
