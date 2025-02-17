import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  onDeleteError: () => void;
};

export const Error: React.FC<Props> = ({ errorMessage, onDeleteError }) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !errorMessage,
    })}
  >
    <button
      onClick={onDeleteError}
      data-cy="HideErrorButton"
      type="button"
      className="delete"
    />
    {errorMessage}
  </div>
);
