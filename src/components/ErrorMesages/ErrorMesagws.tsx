import cn from 'classnames';
import React from 'react';

interface Props {
  loadError: string;
  setLoadError: (message: string) => void;
}

export const ErrorMesages: React.FC<Props> = ({ loadError, setLoadError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !loadError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setLoadError('')}
      />
      {loadError}
      {/* Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
    </div>
  );
};
