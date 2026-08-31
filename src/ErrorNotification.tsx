import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from './types';

type Props = {
  error: ErrorMessage | null;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => (
  <div
    className={classNames('notification is-danger', { hidden: !error })}
    data-cy="ErrorNotification"
  >
    <button
      type="button"
      className="delete"
      data-cy="HideErrorButton"
      aria-label="Hide error"
      onClick={onClose}
    />
    {error}
  </div>
);
