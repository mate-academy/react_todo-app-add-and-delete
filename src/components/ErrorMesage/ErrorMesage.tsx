import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  hasError: boolean;
  setHasError: (boolean: boolean) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  hasError,
  setHasError,
}) => {
  return (
    <div className={
      classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !hasError,
        },
      )
    }
    >
      <button
        aria-label="close"
        type="button"
        className="delete"
        onClick={() => setHasError(false)}
      />
      <span>{errorMessage}</span>
    </div>
  );
};
