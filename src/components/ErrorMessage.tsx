import { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  error: string,
  setError: (arg: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  error,
  setError,
}) => {
  const [hideError, setHideError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error, hideError]);

  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={
          classNames(
            'notification is-danger is-light has-text-weight-normal',
            {
              hidden: hideError,
            },
          )
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="delete"
          onClick={() => setHideError(true)}
        />
        {error}
      </div>
    </>
  );
};
