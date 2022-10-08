import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMessage: string;
  handleError: (value: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleError,
}) => {
  const [hideError, setHideError] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => handleError(''), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage, hideError]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: hideError },
      )}
      data-cy="ErrorNotification"
    >
      <button
        aria-label="close"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHideError(true)}
      />
      {errorMessage}
    </div>
  );
};
