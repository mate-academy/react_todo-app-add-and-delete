import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext, UpdateTodosContext } from '../context/todosContext';

export const NotificationBlock: React.FC = () => {
  const {
    errorMessage,
    isNotificationOpen,
  } = useContext(TodosContext);

  const {
    setIsNotificationOpen,
  } = useContext(UpdateTodosContext);

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
