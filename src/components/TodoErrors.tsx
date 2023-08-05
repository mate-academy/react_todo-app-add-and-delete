/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect } from 'react';

interface Error {
  error: string,
  unSetError: () => void,
}

export const TodoErrors: React.FC<Error> = ({
  error,
  unSetError,
}) => {
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        unSetError();
      }, 3000);
    }
  }, [error]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={unSetError}
      />
      {error}
    </div>
  );
};
