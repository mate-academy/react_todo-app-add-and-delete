import React from 'react';
import cn from 'classnames';

type Props = {
  message: string | null;
  onCLose: () => void;
};

export const TodoError: React.FC<Props> = ({ message, onCLose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !message,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCLose}
      />
      {message}
    </div>
  );
};
