import classNames from 'classnames';
import ErrorContext from '../../contexts/Errors/ErrorsContext';

export const ErrorNotification = () => {
  const { error } = ErrorContext.useState();
  const { clearError } = ErrorContext.useContract();

  /*
    { show only one message at a time }
    Unable to load todos
    <br />
    Title should not be empty
    <br />
    Unable to add a todo
    <br />
    Unable to delete a todo
    <br />
    Unable to update a todo
  */

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        onClick={clearError}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {error}
    </div>
  );
};
