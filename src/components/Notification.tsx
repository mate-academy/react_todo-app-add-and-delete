import { FC, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  error: string;
  hideNotification: boolean;
  setHideNotification: (par: boolean) => void;
};

export const Notification: FC<Props> = ({
  error,
  hideNotification,
  setHideNotification,
}) => {
  useEffect(() => {
    if (!hideNotification) {
      setTimeout(() => {
        setHideNotification(true);
      }, 3000);
    }
  });

  return (
    // {/* Notification is shown in case of any error */}
    //   {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: hideNotification,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="close"
        onClick={() => setHideNotification(true)}
      />
      {/* show only one message at a time
      Unable to load todos
      <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
      {error}
    </div>
  );
};
