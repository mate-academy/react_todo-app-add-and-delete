/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect } from 'react';

interface Error {
  error: string,
  setError: () => void,
}

export const TodoErrors: React.FC<Error> = ({
  error,
  setError,
}) => {
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError();
      }, 3000);
    }
  }, [error]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >

      <button
        type="button"
        className="delete"
        onClick={setError}
      />

      {error}
    </div>
  );
};
