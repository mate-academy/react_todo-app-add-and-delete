import React from 'react';
import classNames from 'classnames';

type ErrorProps = {
  hasError: boolean;
  setHasError: (error: boolean) => void;
  errorMessage: string;
};

export const Error: React.FC<ErrorProps> = ({
  hasError,
  setHasError,
  errorMessage,
}) => (
  <div className={classNames(
    'notification is-danger is-light has-text-weight-normal',
    {
      hidden: !hasError,
    },
  )}
  >
    <button
      aria-label="hide-error"
      type="button"
      className="delete"
      onClick={() => setHasError(false)}
    />

    {errorMessage}
  </div>
);
