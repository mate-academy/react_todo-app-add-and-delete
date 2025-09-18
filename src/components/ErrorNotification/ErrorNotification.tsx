import React from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../../types/Errors';

interface Props {
  errorMessage: ErrorMessages | '';
  onErrorMessage: (message: ErrorMessages | '') => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onErrorMessage,
}) => {
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
        onClick={() => onErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
};
