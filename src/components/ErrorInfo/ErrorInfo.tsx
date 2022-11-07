/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoError } from '../../types/TodoFilter';

type Error = {
  errorType: TodoError
  errorButtonHandler: () => void
};

export const ErrorInfo: React.FC<Error> = ({
  errorType,
  errorButtonHandler,
}) => {
  return (
    <>
      {errorType === TodoError.add && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={errorButtonHandler}
          />

          Unable to add a todo
        </div>
      )}

      {errorType === TodoError.delete && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={errorButtonHandler}
          />

          Unable to delete a todo
        </div>
      )}

      {errorType === TodoError.update && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={errorButtonHandler}
          />

          Unable to update a todo
        </div>
      )}

      {errorType === TodoError.empty && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={errorButtonHandler}
          />

          Title can not be empty
        </div>
      )}
    </>
  );
};
