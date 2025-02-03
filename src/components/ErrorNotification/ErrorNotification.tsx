import { useState, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  message: string;
};

export const ErrorNotification: React.FC<Props> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleErrorClose = () => {
    setIsVisible(false);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isVisible,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          handleErrorClose();
        }}
      />
      {message}
    </div>
  );
};
