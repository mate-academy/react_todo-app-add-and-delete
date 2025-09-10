import cn from 'classnames';
import { useEffect, useState } from 'react';

type ErrorNotificationProps = {
  messege: string;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  messege,
}) => {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (!messege) {
      setIsHidden(true);

      return;
    }

    setIsHidden(false);
    const timer = setTimeout(() => {
      setIsHidden(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [messege]);

  function handleClose() {
    setIsHidden(true);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: isHidden,
      })}
    >
      <button
        onClick={handleClose}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {messege}
    </div>
  );
};
