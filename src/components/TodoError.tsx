/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';
import cn from 'classnames';
import { Error } from '../types/Error';

type Props = {
  error: Error,
  onErrorChange: (error: Error) => void,
};

export const TodoError: React.FC<Props> = ({ error, onErrorChange }) => {
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => onErrorChange(Error.None), 3000);

      clearTimeout(timeoutId);
    }
  }, [error, onErrorChange]);

  return (
    <div className={cn('notification',
      'is-danger is-light has-text-weight-normal', {
        hidden: error === Error.None,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => onErrorChange(Error.None)}
      />
      {error}
    </div>
  );
};
