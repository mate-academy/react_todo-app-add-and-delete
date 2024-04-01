import { useEffect } from 'react';
import { Errors } from '../types/Error';

type Props = {
  error: Errors | null;
  setError: (error: Errors | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        aria-label="deleteError"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error && `${error}`}
    </div>
  );
};
