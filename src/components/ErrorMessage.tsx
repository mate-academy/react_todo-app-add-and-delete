import React from 'react';
import classNames from 'classnames';

type Props = {
  error: boolean;
  errorMessage: string;
  handleErrorMessage: (boolean: boolean) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  error,
  errorMessage,
  handleErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === false },
      )}
    >
      <button
        aria-label="delete"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleErrorMessage(false)}
      />
      {errorMessage}
    </div>
  );
};
