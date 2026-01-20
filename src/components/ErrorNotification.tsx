import React from 'react';
import classNames from 'classnames';

interface Props {
  message: string;
  onHide: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  message,
  onHide,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification is-danger error-notification', {
        hidden: !message,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHide}
      />
      {message}
    </div>
  );
};
