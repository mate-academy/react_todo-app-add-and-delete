/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (value: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  setTimeout(() => {
    setErrorMessage('');
  }, 3000);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
};
