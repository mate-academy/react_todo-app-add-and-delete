import { FC, useState } from 'react';

interface Props {
  message: string;
}

export const Notification: FC<Props> = ({ message }) => {
  const [isHidden, setIsHidden] = useState(true);

  const handleNotificationClose = () => {
    setIsHidden(!isHidden);
  };

  return (
    <>
      {isHidden && (
        <div
          className="notification is-danger is-light has-text-weight-normal"
          hidden={message === ''}
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={handleNotificationClose}
          />
          {message}
        </div>
      )}
    </>
  );
};
