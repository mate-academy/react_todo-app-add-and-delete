import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';
/* eslint-disable jsx-a11y/control-has-associated-label */

interface Props {
  errorMessage: ErrorMessage,
  setErrorMessage: (newErrorMessage: ErrorMessage) => void,
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !errorMessage },
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
