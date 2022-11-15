/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  hasError: boolean;
  hideError: () => void;
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props> = ({
  hasError,
  hideError,
  errorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
      { hidden: !hasError },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={hideError}
    />

    {errorMessage}
  </div>
);
