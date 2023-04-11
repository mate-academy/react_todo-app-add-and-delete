import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string,
  setErrorMessage: (value: string) => void,
};

export const ErrorMessage: React.FC<Props> = React.memo(
  ({
    errorMessage,
    setErrorMessage,
  }) => {
    return (
      <div
        className={
          classNames(
            'notification is-danger is-light has-text-weight-normal', {
              hidden: !errorMessage,
            },
          )
        }
      >
        <button
          type="button"
          className="delete"
          aria-label="delete error"
          onClick={() => setErrorMessage('')}
        />

        <span>{errorMessage}</span>
      </div>
    );
  },
);
