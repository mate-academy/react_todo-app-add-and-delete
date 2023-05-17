import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  message: string;
  onDelete: () => void;
};

export const Error: React.FC<Props> = ({ message, onDelete }) => {
  useEffect(() => {
    setTimeout(() => onDelete(), 3000);
  }, [message]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: message.length === 0,
      },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => onDelete()}
      />
      {message}
    </div>
  );
};
