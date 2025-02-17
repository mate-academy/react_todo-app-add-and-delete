import React, { useContext } from 'react';
import { TodoContext } from '../../contexts/TodoContext';

export const Notification: React.FC = () => {
  const { currentErrorMessage, putErrorWarning } = useContext(TodoContext)!;
  const handleCloseNotification = () => {
    putErrorWarning('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${currentErrorMessage.length ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseNotification}
      />
      {/* show only one message at a time */}
      {currentErrorMessage}
      <br />
    </div>
  );
};
