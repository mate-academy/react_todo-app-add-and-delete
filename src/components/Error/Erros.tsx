import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  hideError: (arg: string) => void;
};

export const Error: React.FC<Props> = ({ errorMessage, hideError }) => {
  useEffect(() => {
    setTimeout(() => hideError(''), 3000);
  });

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
        onClick={() => hideError('')}
      />
      {errorMessage}
    </div>
  );
};
