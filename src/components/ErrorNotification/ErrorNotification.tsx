import { useEffect } from 'react';
import { ErrorType } from '../../types/ErrorType';
import classNames from 'classnames';

type Props = {
  error: ErrorType;
  setError: (error: ErrorType) => void;
  onClose: () => void;
};

const errorMessages: Record<ErrorType, string> = {
  load: 'Unable to load todos',
  add: 'Unable to add a todo',
  delete: 'Unable to delete a todo',
  update: 'Unable to update a todo',
  empty: 'Title should not be empty',
  '': '',
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
  onClose,
}) => {
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMessages[error]}
    </div>
  );
};
