import React, { Dispatch, SetStateAction, useEffect } from 'react';
import cn from 'classnames';
import { Error } from '../types/Error';

type Props = {
  error: Error | null;
  setErrorMessage: Dispatch<SetStateAction<Error | null>>;
};
export const ErrorNotification: React.FC<Props> = props => {
  const { error, setErrorMessage } = props;

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage(null);
        }}
      />
      {error}
    </div>
  );
};
