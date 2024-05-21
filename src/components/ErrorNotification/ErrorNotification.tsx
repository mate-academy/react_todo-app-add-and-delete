import React, { FC, SetStateAction } from 'react';
import { ErrorType } from '../../types/Error';
import { errors } from '../../constants/error.contstants';

export interface IErrorNotification {
  error: ErrorType | null;
  setError: React.Dispatch<SetStateAction<ErrorType | null>>;
}

export const ErrorNotification: FC<IErrorNotification> = ({
  error,
  setError,
}) => {
  const errorMessage = error ? errors[error].message : '';

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
    </div>
  );
};
