import cn from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  message: string,
  hidden: boolean,
  setHideNotification: Dispatch<SetStateAction<boolean>>,
};

export const Notification: React.FC<Props> = ({
  message,
  hidden,
  setHideNotification,
}) => {
  return (
    <>
      { message.length > 0 && (
        <div
          className={cn(
            'notification is-danger is-light has-text-weight-normal',
            { hidden },
          )}
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={() => setHideNotification(true)}
          />
          {message}

          {/* show only one message at a time */}
          {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
        </div>
      )}
    </>
  );
};
