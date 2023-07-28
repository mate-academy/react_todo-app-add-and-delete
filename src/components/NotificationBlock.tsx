import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/todosContext';
import { wait } from '../utils/fetchClient';

export const NotificationBlock: React.FC = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const {
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);

  function showNotificationBlock() {
    setIsNotificationOpen(true);

    wait(3000)
      .then(() => {
        setIsNotificationOpen(false);
        setErrorMessage('');
      });
  }

  useEffect(() => {
    if (errorMessage) {
      showNotificationBlock();
    }
  }, [errorMessage]);

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !isNotificationOpen,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setIsNotificationOpen(false)}
        aria-label="Close error notification"
      />
      {errorMessage}
    </div>
  );
};
