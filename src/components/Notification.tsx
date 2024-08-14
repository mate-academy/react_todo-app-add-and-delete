import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  onClose: (message: string) => void;
};

export const Notification: React.FC<Props> = ({ errorMessage, onClose }) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
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
      onClick={() => onClose('')}
    />
    {/* show only one message at a time */}
    {errorMessage}
    <br />
  </div>
);
