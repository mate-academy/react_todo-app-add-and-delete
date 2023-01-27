/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType;
  setError: Dispatch<SetStateAction<ErrorType>>
};

export const ErrorMessage:React.FC<Props> = ({
  error,
  setError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setError(ErrorType.None);
    }, 3000);
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorType.None)}
      />
      {error}
    </div>
  );
};
