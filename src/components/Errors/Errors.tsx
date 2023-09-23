import { useContext } from 'react';
import { ErrorsContext } from '../../providers/ErrorsProvider/ErrorsProvider';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Errors = () => {
  const contextErrors = useContext(ErrorsContext);

  const { errors, clearErrors } = contextErrors;

  const {
    errorEmptyTitle,
    errorLoadingTodos,
    errorUnableToAddTodo,
    errorUnableToDeleteTodo,
    errorUpdateTodo,
  } = errors;

  if (Object.values(errors).every(error => error === false)) {
    return null;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearErrors}
      />
      {/* show only one message at a time */}
      {errorLoadingTodos && (
        <>
          Unable to load todos
          <br />
        </>
      )}

      {errorEmptyTitle && (
        <>
          Title should not be empty
          <br />
        </>
      )}

      {errorUnableToAddTodo && (
        <>
          Unable to add a todo
          <br />
        </>
      )}

      {errorUnableToDeleteTodo && (
        <>
          Unable to delete a todo
          <br />
        </>
      )}

      {errorUpdateTodo && 'Unable to update a todo'}
    </div>
  );
};
