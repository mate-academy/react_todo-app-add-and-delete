/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React from 'react';

interface Props {
  error: string
  removeError: (string: string) => void
}

export const ErrorField: React.FC<Props> = ({ error, removeError }) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
  >
    {/* Notification is shown in case of any error */}
    {/* Add the 'hidden' class to hide the message smoothly */}
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => removeError('')}
    />
    {/* show only one message at a time */}
    {error}
  </div>
);

// Unable to load todos
// <br />
// Title should not be empty
// <br />
// Unable to add a todo
// <br />
// Unable to delete a todo
// <br />
// Unable to update a todo
