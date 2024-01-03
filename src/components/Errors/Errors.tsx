import { useTodos } from '../../context/TodoProvider';

export const Errors = () => {
  const { errorMessage } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={errorMessage === ''
        ? 'notification is-danger is-light has-text-weight-normal hidden'
        : 'notification is-danger is-light has-text-weight-normal'}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide Error Message"
      />
      {/* show only one message at a time */}
      {errorMessage}
      {/* <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
