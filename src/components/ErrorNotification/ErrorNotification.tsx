import { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  error: Error | null,
  setIsError: (arg: Error | null) => void,
};

export const ErrorNotification: React.FC<Props> = ({ error, setIsError }) => {
  useEffect(() => {
    setTimeout(() => {
      setIsError(null);
    }, 3000);
  }, []);

  const getErrorNotification = useMemo(() => {
    switch (error) {
      case Error.Add:
        return 'Unable to add a todo';
      case Error.Delete:
        return 'Unable to delete a todo';
      case Error.Update:
        return 'Unable to update a todo';
      case Error.Empty:
        return 'Title can\'t be empty';
      default:
        return null;
    }
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        ('notification is-danger is-light has-text-weight-normal'),
        { hidden: !error },
      )}
    >
      <button
        aria-label="delete"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(null)}
      />
      {getErrorNotification}
    </div>
  );
};
