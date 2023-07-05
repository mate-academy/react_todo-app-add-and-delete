import { FC, useEffect } from 'react';

interface NotificationsProps {
  onClose: () => void,
  errorMessage: string,
}

export const Notifications: FC<NotificationsProps> = (props) => {
  const { onClose, errorMessage } = props;

  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 3000);
  }, []);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={onClose}
      />
      <p>{errorMessage}</p>
      {/* show only one message at a time */}
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
