import { Dispatch, SetStateAction, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  error: string;
  setError: Dispatch<SetStateAction<string>>;
};

export const Error: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error.length,
      })}
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
