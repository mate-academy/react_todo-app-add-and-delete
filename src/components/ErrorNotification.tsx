import classNames from 'classnames';
import React, { memo, useEffect } from 'react';
import { debounce } from '../utils/debounce';

type Props = {
  error: string;
  onHideError: () => void;
};

/* 
  DON'T use conditional rendering to hide the notification
  Add the 'hidden' class to hide the message smoothly 
*/
export const ErrorNotification: React.FC<Props> = memo(
  ({ error, onHideError }) => {
    const hideErrorDebounce = debounce(onHideError, 3000);

    useEffect(() => {
      hideErrorDebounce('');
    }, [hideErrorDebounce]);

    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onHideError}
        />
        {error}
      </div>
    );
  },
);
ErrorNotification.displayName = 'ErrorNotificationMemo';

/* === All error messages ===

  Unable to load todos
  Title should not be empty
  Unable to add a todo
  Unable to delete a todo
  Unable to update a todo 
*/
