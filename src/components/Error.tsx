/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
  onClose: () => void;
};

export const Error: React.FC<Props> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      setTimeout(() => onClose, 3000);
    }
  }, [message]);

  return (
    <div className={
      classNames('notification is-danger is-light has-text-weight-normal',
        { hidden: message.length === 0 })
    }
    >
      <button
        type="button"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
