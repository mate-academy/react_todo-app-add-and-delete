import { useEffect, useState } from 'react';
import { Error } from '../../types/Error';
import cn from 'classnames';

interface Props {
  error: Error | null;
}

export const ErrorMessage: React.FC<Props> = ({ error }) => {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (error) {
      setIsError(true);
    }

    const hideError = setTimeout(() => {
      setIsError(false);
    }, 3000);

    return () => {
      clearTimeout(hideError);
    };
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(false)}
      />
      {error}
    </div>
  );
};
