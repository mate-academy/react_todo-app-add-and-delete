import classNames from 'classnames';
import React from 'react';
import { ErrorMessages } from '../types/err';

type Props = {
  errorMessage: ErrorMessages | null;
  setErrorMessage: (err: ErrorMessages | null) => void;
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
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
