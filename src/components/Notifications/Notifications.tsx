/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../../Context/TodosContext';
import { Error } from '../../types/Error';

export const Notifications = () => {
  const { errorMessage, handleErrorMessage } = useContext(TodosContext);

  const handleCloseNotification = () => {
    handleErrorMessage(Error.None);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className={cn('delete', {
          hidden: errorMessage,
        })}
        onClick={handleCloseNotification}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
