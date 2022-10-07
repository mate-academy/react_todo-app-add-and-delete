import classNames from 'classnames';
import { useState, useEffect } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (params: string) => void;
};

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  const [error, setError] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="button"
        type="button"
        className="delete"
        onClick={() => setError(false)}
      />
      {errorMessage}
    </div>
  );
};
