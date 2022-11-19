import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  isErrorMessage: ErrorTypes,
  setIsErrorMessage: (value: ErrorTypes) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  isErrorMessage, setIsErrorMessage,
}) => {
  const [onCloseError, setOnCloseError] = useState(false);

  const ErrorText = {
    [ErrorTypes.load]: 'Unable to load a todo',
    [ErrorTypes.upload]: 'Unable to add a todo',
    [ErrorTypes.delete]: 'Unable to delete a todo',
    [ErrorTypes.title]: 'Title can\'t be empty',
    [ErrorTypes.none]: '',
  };

  useEffect(() => {
    setTimeout(() => {
      setIsErrorMessage(ErrorTypes.none);
    }, 3000);
  }, [isErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: onCloseError || isErrorMessage === ErrorTypes.none },
      )}
    >
      <button
        aria-label="delete"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setOnCloseError(true)}
      />
      {ErrorText[isErrorMessage] || ''}
      <br />
    </div>
  );
};
