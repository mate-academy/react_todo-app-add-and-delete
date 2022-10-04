import classNames from 'classnames';
import { useEffect } from 'react';

interface Props {
  error: string,
  setHideError: (value: boolean) => void,
  hideError: boolean,
  setError: (value: string) => void
}

export const ErrorMessage: React.FC<Props> = ({
  error,
  setHideError,
  hideError,
  setError,
}) => {
  useEffect(() => {
    const timer = window.setTimeout(() => setError(''), 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <>
      {error.length > 0 && (
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
            aria-label="delete"
            className="delete"
            onClick={() => setHideError(true)}
          />
          {error}
        </div>
      )}
    </>
  );
};
