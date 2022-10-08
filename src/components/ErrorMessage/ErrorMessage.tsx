/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

type Props = {
  error: string;
  onCloseError: () => void;
};

export const ErrorMessage: React.FC<Props> = ({ error, onCloseError }) => {
  const handleCloseError = () => {
    onCloseError();
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseError}
      />

      {error}
    </div>
  );
};
