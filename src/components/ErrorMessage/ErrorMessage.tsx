import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  setError: (item: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  error,
  setError,
}) => {
  const [isError, setIsError] = useState(false);

  setTimeout(() => setError(''), 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="close"
        onClick={() => setIsError(true)}
      />
      {error}
    </div>
  );
};
