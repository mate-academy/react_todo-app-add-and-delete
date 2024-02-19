/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string,
};

export const Notification: React.FC<Props> = (
  {
    errorMessage,
  },
) => {
  const [hidden, setHidden] = useState(false);

  setTimeout(() => setHidden(true), (3000));

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('is-light has-text-weight-normal', {
        hidden,
        'is-danger': errorMessage,
        notification: errorMessage,
      })}
    >
      {errorMessage && (
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setHidden(true)}
        />
      )}
      {errorMessage}
      {/* show only one message at a time */}
      {/* Unable to load todos
      <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
