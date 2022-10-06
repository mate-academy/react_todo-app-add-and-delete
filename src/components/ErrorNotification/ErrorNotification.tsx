import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (arg: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage, isError]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: isError,
        },
      )}
      data-cy="ErrorNotification"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(true)}
        aria-label="close"
      />
      {errorMessage}
    </div>
  );
};
