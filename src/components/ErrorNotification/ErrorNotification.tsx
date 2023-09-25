/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../utils/errorMessages';

type Props = {
  setErrorMessage: (value: ErrorMessage) => void;
  errorMessage: ErrorMessage;
};

export const ErrorNotification: React.FC<Props> = ({
  setErrorMessage,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === ErrorMessage.Default },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.Default)}
      />

      {errorMessage}
    </div>
  );
};
