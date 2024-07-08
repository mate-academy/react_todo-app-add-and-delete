import React from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string;
  onErrorMessage: (val: string) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onErrorMessage,
}) => {
  setTimeout(() => onErrorMessage(''), 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessage('')}
      />
      {errorMessage}
      {/* Unable to update a todo */}
    </div>
  );
};
