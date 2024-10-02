import classNames from 'classnames';
import React from 'react';
import { ErrorMessages } from '../enum/ErrorMassages';

type Props = {
  errorMessage: ErrorMessages;
  onClearError: () => void;
};

export const ErrorBox: React.FC<Props> = ({ errorMessage, onClearError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClearError}
      />
      {errorMessage}
    </div>
  );
};
