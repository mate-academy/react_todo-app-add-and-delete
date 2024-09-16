import classNames from 'classnames';
import React from 'react';

export enum ErrorMessage {
  load = 'Unable to load todos',
  emptyTitle = 'Title should not be empty',
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
}

type Props = {
  message: ErrorMessage | null;
  onClearMessage: () => void;
};

export const Notification: React.FC<Props> = ({ message, onClearMessage }) => {
  return (
    // {/* DON'T use conditional rendering to hide the notification */}
    // {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onClearMessage();
        }}
      />
      {message}
    </div>
  );
};
