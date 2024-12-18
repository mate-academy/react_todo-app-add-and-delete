import { Dispatch, SetStateAction, useEffect } from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType;
  setError: Dispatch<SetStateAction<ErrorType>>;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    if (error === ErrorType.Empty) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(ErrorType.Empty);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: error === ErrorType.Empty,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorType.Empty)}
      />
      {error}
    </div>
  );
};
