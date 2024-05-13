import { FC, SetStateAction } from 'react';

import { errors } from '../../constants';

import { ErrorType } from '../../types';

export interface IErrorNotification {
  errorType: ErrorType | null;
  setError: React.Dispatch<SetStateAction<ErrorType | null>>;
}

export const ErrorNotification: FC<IErrorNotification> = ({
  errorType,
  setError,
}) => {
  const errorMessage = errorType ? errors[errorType].message : '';

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorType ? 'hidden' : ''}`}
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
