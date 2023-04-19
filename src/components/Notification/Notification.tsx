/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC, memo, useMemo } from 'react';
import { Error } from '../../types/Error';

interface Props {
  error: Error;
  setError: (param: Error) => void;
}

export const Notification: FC<Props> = memo(({
  error,
  setError,
}) => {
  const errorMessage = useMemo(() => {
    switch (error) {
      case Error.Empty:
        return "Title can't be empty!";

      case Error.Get:
        return 'Unable to get a todos';

      case Error.Add:
        return 'Unable to add a todo';

      case Error.Delete:
        return 'Unable to delete a todo';

      default:
        return Error.None;
    }
  }, [error]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(Error.None)}
      />
      {errorMessage}
    </div>
  );
});
