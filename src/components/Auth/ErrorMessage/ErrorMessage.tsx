/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { ErrorType } from '../../../utils/enums/ErrorType';

type Props = {
  onClose: () => void;
  errorType: ErrorType;
};

export const ErrorMessage: React.FC<Props> = ({
  onClose,
  errorType,
}) => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    switch (errorType) {
      case ErrorType.Add:
        setErrorMessage('Unable to add a todo');
        break;

      case ErrorType.Delete:
        setErrorMessage('Unable to delete a todo');
        break;

      case ErrorType.Update:
        setErrorMessage('Unable to update a todo');
        break;

      case ErrorType.Empty:
        setErrorMessage('Title can\'t be empty');
        break;

      case ErrorType.Load:
        setErrorMessage('Unable to load todos');
        break;

      default: setErrorMessage('Something went wrong');
    }
  }, [errorType]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={errorType === ErrorType.None}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {errorMessage}
    </div>
  );
};
