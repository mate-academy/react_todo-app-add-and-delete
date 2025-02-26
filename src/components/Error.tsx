import React from 'react';
import classNames from 'classnames';

interface Props {
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
}

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  const errorClass = classNames(
    'notification',
    'is-danger',
    'is-light',
    'has-text-weight-normal',
    {
      hidden: errorMessage.length === 0,
    },
  );

  return (
    <div data-cy="ErrorNotification" className={errorClass}>
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
