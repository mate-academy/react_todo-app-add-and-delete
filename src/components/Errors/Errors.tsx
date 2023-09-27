import cn from 'classnames';
import { useErrorsContext }
  from '../../providers/ErrorsProvider/ErrorsProvider';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Errors = () => {
  const { errors, clearErrors } = useErrorsContext();
  const {
    errorEmptyTitle,
    errorLoadingTodos,
    errorUnableToAddTodo,
    errorUnableToDeleteTodo,
    errorUpdateTodo,
  } = errors;

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: Object.values(errors).every(error => error === false),
      })}
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
      {errorUpdateTodo && <>Unable to update a todo</>}
    </div>
  );
};
