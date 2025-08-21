import { useEffect } from 'react';

type Props = {
  hidden: boolean;
  setError: (err: string) => {};
  error: string;
};

export const ErrorNotification: React.FC<Props> = ({
  hidden,
  setError,
  error,
}) => {
  const ERROR_CLEANUP_TIMEOUT = 3000;

  useEffect(() => {
    if (hidden) {
      setTimeout(() => {
        setError('');
      }, ERROR_CLEANUP_TIMEOUT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!hidden ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError('');
        }}
      />
      {error}
    </div>
  );
};
