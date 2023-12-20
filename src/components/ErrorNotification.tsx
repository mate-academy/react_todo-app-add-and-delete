import cn from 'classnames';
import { useEffect } from 'react';
import { Errors } from '../types/Errors';

type Props = {
  setError: (value: Errors | null) => void,
  error: Errors | null,
};
export const ErrorNotification: React.FC<Props> = ({ setError, error }) => {
  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        aria-label="deleteError"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
