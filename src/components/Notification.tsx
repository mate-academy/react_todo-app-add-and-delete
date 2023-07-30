import { useEffect } from 'react';
import cn from 'classnames';
import { ErrorType } from '../types/Error';

type Props = {
  error: ErrorType;
  setError: (error: ErrorType) => void;
};

export const Notification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    setTimeout(() => {
      setError(ErrorType.None);
    }, 3000);
  }, [error]);

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: error === ErrorType.None,
      })}
    >
      <button
        type="button"
        className="delete"
        id="deleteButton"
        onClick={() => setError(ErrorType.None)}
      >
        Delete
      </button>
      {error === ErrorType.Load && <>Unable to load todos</>}
      {error === ErrorType.Add && <>Unable to add a todo</>}
      {error === ErrorType.Delete && <>Unable to delete a todo</>}
      {error === ErrorType.Update && <>Unable to update a tod</>}
      {error === ErrorType.Empty && <>{'Title can\'t be empty'}</>}
    </div>
  );
};
