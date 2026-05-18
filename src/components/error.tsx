import { useEffect } from 'react';

export const Error = ({
  error,
  setError,
}: {
  error: string | null;
  setError: (val: string | null) => void;
}) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timeout = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timeout);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};

export default Error;
