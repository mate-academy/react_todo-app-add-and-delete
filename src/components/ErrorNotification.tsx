import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  errorMessage: ErrorMessage | '';
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => (
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
      onClick={onClose}
    />
    {errorMessage}
  </div>
);
