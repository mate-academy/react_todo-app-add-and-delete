import React from 'react';
import classNames from 'classnames';

interface Props {
  message: string | null;
  onHide: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ message, onHide }) => {
  const isVisible = Boolean(message);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification', 'is-danger', 'is-light', {
        hidden: !isVisible,
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
