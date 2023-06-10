import { useEffect } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface TodoNotificationProps {
  message: string;
  onDismiss: () => void;
}

export const TodoNotification: React.FC<TodoNotificationProps> = (
  { message, onDismiss },
) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={onDismiss}
      />

      {message}
    </div>
  );
};
