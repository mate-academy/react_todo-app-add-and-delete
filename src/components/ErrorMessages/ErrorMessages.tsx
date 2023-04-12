import React from 'react';
import classNames from 'classnames';

type Props = {
  showError: boolean;
  onShowError: (value: boolean) => void
  errorMessage: string;
};

export const ErrorMessages: React.FC<Props> = ({
  showError,
  onShowError,
  errorMessage,
}) => {
  return (
    <div className={classNames(
      'notification, is-danger is-light has-text-weight-normal', {
        hidden: !showError,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="hide-error"
        onClick={() => onShowError(false)}
      />

      {errorMessage}
    </div>
  );
};
