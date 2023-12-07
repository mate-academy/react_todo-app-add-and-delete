import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: (massage: string) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  if (errorMessage) {
    setTimeout(() => setErrorMessage(''), 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage}
        aria-label="error"
      />
      {errorMessage}
    </div>
  );
};
