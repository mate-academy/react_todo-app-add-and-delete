import { useEffect } from 'react';

interface ErrorsProps {
  error: string | null;
  setError: (error: string | null) => void;
  isSubmitting: boolean;
}

export const Errors: React.FC<ErrorsProps> = ({
  error,
  setError,
  isSubmitting,
}) => {
  useEffect(() => {
    if (error !== null) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
        disabled={isSubmitting}
      />
      {error}
    </div>
  );
};
