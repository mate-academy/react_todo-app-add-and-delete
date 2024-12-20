import React from 'react';
import { ErrorType } from '../../types/ErrorType';
import classNames from 'classnames';

type Props = {
  errorType: ErrorType;
  setErrorType: (error: ErrorType) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorType,
  setErrorType,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorType === ErrorType.NO_ERROR },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorType(ErrorType.NO_ERROR)}
      />
      {errorType}
    </div>
  );
};
