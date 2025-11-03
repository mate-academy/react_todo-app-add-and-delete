import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { TypeErrMes } from '../types/Error';

type Props = {
  errorMessage: TypeErrMes | null;
  onDeleteErrorMessage: () => void;
};

export const ErrorMessage = ({ errorMessage, onDeleteErrorMessage }: Props) => {
  const timerId = useRef<number | null>(null);

  useEffect(() => {
    if (timerId.current !== null) {
      clearTimeout(timerId.current);
    }

    if (errorMessage !== null) {
      timerId.current = window.setTimeout(() => {
        onDeleteErrorMessage();
      }, 3000);
    }

    return () => {
      if (timerId.current !== null) {
        clearTimeout(timerId.current);
      }
    };
  }, [errorMessage, onDeleteErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === null,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onDeleteErrorMessage()}
      />
      {errorMessage}
    </div>
  );
};
