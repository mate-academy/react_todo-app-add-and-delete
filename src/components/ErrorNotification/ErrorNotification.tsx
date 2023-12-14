import React from 'react';
import cn from 'classnames';
import { Message } from '../../types/Message';

type Props = {
  errorMessage: Message | '',
  setErrorMessage: (m: Message | '') => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  setTimeout(() => {
    setErrorMessage('');
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        aria-label="Close message"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
