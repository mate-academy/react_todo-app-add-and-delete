import React, { Dispatch, SetStateAction, useEffect } from 'react';
import cn from 'classnames';
import { TodoErrorType } from '../types/TodoErrorType';

type Props = {
  error: TodoErrorType;
  setError: Dispatch<SetStateAction<TodoErrorType>>;
};

export const Error: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(TodoErrorType.None);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error, setError]);

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
        onClick={() => setError(TodoErrorType.None)}
      />
      {error}
    </div>
  );
};
