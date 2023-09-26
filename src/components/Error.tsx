import { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/TodoContext';

// enum ErrorMessages {
//   'Unable to load todos',
//   'Title should not be empty',
//   'Unable to add a todo',
//   'Unable to delete a todo',
//   'Unable to update a todo',
// }

export const Error = () => {
  const { handleCloseError, error } = useContext(TodosContext);

  const handleButtonClick = () => {
    handleCloseError();
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        title="errorButton"
        onClick={handleButtonClick}
        aria-label="HideErrorButton"
      />
      {error}
    </div>
  );
};
