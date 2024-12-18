import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  error: string;
  handleErrorClose: () => void;
};

export const ErrorNotification: React.FC<Props> = props => {
  const { error, handleErrorClose } = props;

  useEffect(() => {
    if (error === ErrorTypes.NoErrors) {
      return;
    }

    const timeoutId = setTimeout(() => {
      handleErrorClose();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

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
        onClick={handleErrorClose}
      />
      {error}
    </div>
  );
};
