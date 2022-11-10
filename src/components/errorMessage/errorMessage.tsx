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
      {typeError === 'download' && 'Unable to download todos'}
      {typeError === 'add' && 'Unable to add a todo'}
      {typeError === 'delete' && 'Unable to delete a todo'}
      {typeError === 'update' && 'Unable to update a todo'}
      {typeError === 'emptyTitle' && 'Title can\'t be empty'}
    </div>
  );
};
