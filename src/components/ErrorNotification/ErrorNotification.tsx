import cn from 'classnames';
import { useTodosContext } from '../../context/TodosProvider';
import { TodosError } from '../../types/TodosErrors';

const ErrorNotification = () => {
  const { errorMessage, handleErrorMessage } = useTodosContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="delete error"
        onClick={handleErrorMessage(TodosError.NONE)}
      />
      {errorMessage}
    </div>
  );
};

export default ErrorNotification;
