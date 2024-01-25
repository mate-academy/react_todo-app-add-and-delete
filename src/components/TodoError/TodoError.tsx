import React, { useEffect } from 'react';
import cn from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  error: Error,
  setError: (error: Error) => void,
};

export const TodoError: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    if (error) {
      setTimeout(() => setError(Error.NONE), 3000);
    }
  }, [error]);

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: Error.NONE,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(Error.NONE)}
        aria-label="delete"
      />
      {error}
    </div>
  );
};
