import React from 'react';
import { ErrorType } from '../types/Error';
import cn from 'classnames';

type Props = {
  error: ErrorType | null;
  setError: (value: ErrorType | null, time?: number) => void;
};

export const Error: React.FC<Props> = ({ error, setError }) => {
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
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
