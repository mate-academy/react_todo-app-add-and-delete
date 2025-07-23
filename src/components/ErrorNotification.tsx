import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  message: ErrorMessage | '';
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !message },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onClose}
    />
    {message}
  </div>
);
