import React from 'react';
import cn from 'classnames';

import { Errors } from './types/Errors';

interface Props {
  errorMessage: Errors | null;
  onDeleteClick: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onDeleteClick,
}) => {
  // console.log(errorMessage);

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
        onClick={onDeleteClick}
      />
      {errorMessage}
    </div>
  );
};
