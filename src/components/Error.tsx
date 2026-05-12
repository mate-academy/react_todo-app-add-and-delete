import { useEffect, useRef } from 'react';

type Props = {
  error: string;
  setError: (value: string) => void;
};

export const Error: React.FC<Props> = ({ error, setError }) => {
  const timerId = useRef<number | null>(null);

  useEffect(() => {
    if (!error) {
      return;
    }

    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
