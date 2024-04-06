import React from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string | null;
  onDeleteClick: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onDeleteClick,
}) => (
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
      onClick={onDeleteClick}
    />
    {errorMessage}
  </div>
);
