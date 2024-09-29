import classNames from 'classnames';
import React from 'react';

interface Props {
  errorMessage: string;
  removeError: () => void;
  isHiddenError: boolean;
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  removeError,
  isHiddenError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHiddenError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={removeError}
      />
      {errorMessage}
    </div>
  );
};
