import React, { useEffect } from 'react';
import { ErrorType } from '../../types/ErrorType';
import classNames from 'classnames';

type Props = {
  errorMessageTodo: ErrorType;
  setError: (value: ErrorType) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessageTodo,
  setError,
}) => {
  useEffect(() => {
    if (!errorMessageTodo) {
      return;
    }

    setTimeout(() => {
      setError(ErrorType.ERROR_DEFAULT);
    }, 3000);
  }, [errorMessageTodo, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessageTodo },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {/* show only one message at a time */}
      {errorMessageTodo}
    </div>
  );
};
