import React from 'react';
import cn from 'classnames';

type Props = {
  message: string;
};

export const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !message,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {message}
    </div>
  );
};
