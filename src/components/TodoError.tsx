import { useEffect } from 'react';
import classNames from 'classnames';
import { Error } from '../types/Error';

type Props = {
  error: Error,
  onErrorChange: (error: Error) => void,
};

export const TodoError: React.FC<Props> = ({ error, onErrorChange }) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (error) {
      timeoutId = setTimeout(() => {
        onErrorChange(Error.None);
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error, onErrorChange]);

  return (
    <div className={classNames('notification',
      'is-danger is-light has-text-weight-normal', {
        hidden: error === Error.None,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => onErrorChange(Error.None)}
        aria-label="close the error window"
      />
      {error}
    </div>
  );
};
