import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div className={
      classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )
    }
    >
      <button
        aria-label="close"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      <span>{errorMessage}</span>
    </div>
  );
};
