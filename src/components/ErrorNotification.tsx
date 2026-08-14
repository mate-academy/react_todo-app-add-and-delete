import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/enums';

interface Props {
  errorMessage: ErrorMessage;
  setErrorMessage: (message: ErrorMessage) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.None)}
      />
      {errorMessage}
    </div>
  );
};
