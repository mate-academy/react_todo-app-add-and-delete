/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (error: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [isError, setIsError] = useState(false);

  setTimeout(() => {
    setIsError(true);
  }, 3000);

  useEffect(() => {
    if (isError) {
      setErrorMessage('');
      setIsError(false);
    }
  });

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
        onClick={() => setIsError(true)}
      />

      {errorMessage}
    </div>
  );
};
