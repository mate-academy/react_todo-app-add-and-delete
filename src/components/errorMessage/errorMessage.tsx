import { MouseEventHandler } from 'react';
import { ErrorTodo } from '../../types/ErrorTodo';

type Props = {
  typeError: ErrorTodo | null,
  onCloseErrorMessage: MouseEventHandler<HTMLButtonElement>,
};

export const ErrorMessage: React.FC<Props> = ({
  typeError,
  onCloseErrorMessage,
}) => {
  const styleError = {
    opacity: 0,
  };

  const styleButton = {
    cursor: 'auto',
  };

  if (typeError) {
    styleButton.cursor = 'pointer';
    styleError.opacity = 1;
  }

  const getTextOfErrorMessage = () => {
    switch (typeError) {
      case ErrorTodo.Add:
        return 'Unable to add todos';

      case ErrorTodo.Delete:
        return 'Unable to delete a todo';

      case ErrorTodo.Download:
        return 'Unable to download todos';

      case ErrorTodo.Update:
        return 'Unable to update a todo';

      case ErrorTodo.EmptyTitle:
        return 'Title can\'t be empty';

      default:
        return undefined;
    }
  };

  return (
    <div
      style={styleError}
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        style={styleButton}
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseErrorMessage}
      />
      {typeError && getTextOfErrorMessage()}
    </div>
  );
};
