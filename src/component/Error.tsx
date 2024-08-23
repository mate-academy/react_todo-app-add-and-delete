import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (err: string) => void;
};

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
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
