import React, { useCallback, useState } from 'react';
import classnames from 'classnames';

type Props = {
  error: string;
};

export const ErrorNotification:React.FC<Props> = ({ error }) => {
  const [hidden, setHidden] = useState(false);

  const autoHideError = useCallback(
    () => {
      setTimeout(() => {
        setHidden(true);
      }, 3000);
    }, [],
  );

  autoHideError();

  return (
    /* Notification is shown in case of any error */
    /* Add the 'hidden' class to hide the message smoothly */
    <div
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setHidden(true)}
        aria-label="Close error notification"
      />
      {error}

      {/* show only one message at a time */}
      {/* Unable to add a todo
      < br />
      Unable to delete a todo
      < br />
      Unable to update a todo */}
    </div>
  );
};
