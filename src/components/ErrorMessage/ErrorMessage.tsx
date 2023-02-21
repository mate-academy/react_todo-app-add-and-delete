import React from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  errorType: ErrorMessages;
  isErrorHidden: boolean;
  closeErrorMessage: () => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorType,
  isErrorHidden,
  closeErrorMessage,
}) => (
  <div
    className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: isErrorHidden,
      },
    )}
  >
    <button
      aria-label="button"
      type="button"
      className="delete"
      onClick={closeErrorMessage}
    />
    {errorType}
  </div>
);
