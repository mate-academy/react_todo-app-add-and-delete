import classNames from 'classnames';
// import { useState } from 'react';

interface Props {
  message: string;
  handleMessage: (error: string) => void;
}

export const Notification: React.FC<Props> = ({
  message,
  handleMessage,
}) => {
  const onDeleteError = () => {
    setTimeout(() => handleMessage(''), 3000);
  };

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !message.length },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */ }
      <button
        type="button"
        className="delete"
        onClick={onDeleteError}
      />
      {message}
    </div>
  );
};
