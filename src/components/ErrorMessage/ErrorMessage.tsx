import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  message: string;
  onDelete: () => void;
};

export const ErrorMessage: React.FC<Props> = (({ message, onDelete }) => {
  useEffect(() => {
    const timerId = setTimeout(() => onDelete(), 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [message]);

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !message.length,
      },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={onDelete}
      />
      {message}
    </div>
  );
});
