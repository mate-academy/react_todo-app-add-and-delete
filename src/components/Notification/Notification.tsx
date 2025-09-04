import cn from 'classnames';
import { useEffect } from 'react';

type Props = {
  message: string;
  onHide: () => void;
};

export const Notification = ({ message, onHide }: Props) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onHide]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !message,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHide}
      />
      {message}
    </div>
  );
};
