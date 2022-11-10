import cn from 'classnames';
import React from 'react';
import { Error } from '../../types/Error';

type Props = {
  error: Error;
  setError: (arg: Error) => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  error,
  setError,
}) => {
  const handleErrorButtonClick = () => {
    setError(Error.NONE);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        {
          hidden: error === Error.NONE,
        })}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorButtonClick}
      />

      {error === Error.ADD && 'Unable to add a todo'}
      {error === Error.DELETE && 'Unable to delete a todo'}
      {error === Error.UPDATE && 'Unable to update a todo'}
      {error === Error.EMPTY && "Title can't be empty"}
    </div>
  );
});
