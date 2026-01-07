import classNames from 'classnames';
import { TodoErrors } from '../types/enums';

type Props = {
  error: TodoErrors | null;
  visible: boolean;
  handleCloseError: () => void;
};

const errorMessages: Record<TodoErrors, string> = {
  [TodoErrors.FetchError]: 'Unable to load todos',
  [TodoErrors.EmptyTitleError]: 'Title should not be empty',
  [TodoErrors.AddError]: 'Unable to add a todo',
  [TodoErrors.DeleteError]: 'Unable to delete a todo',
  [TodoErrors.UpdateError]: 'Unable to update a todo',
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  visible,
  handleCloseError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !visible },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={handleCloseError}
    />
    {error && errorMessages[error]}
  </div>
);
