/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect } from 'react';
import { Error } from '../types/Error';

type Props = {
  error: Error,
  setError: (value: Error) => void,
};

export const TodoErrors: React.FC<Props> = (
  {
    error,
    setError,
  },
) => {
  useEffect(() => {
    setTimeout(() => {
      setError(Error.none);
    }, 3000);
  }, [error, setError]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(Error.none)}
      />
      {error}
    </div>
  );
};
