import cn from 'classnames';

import { useTodosContext } from '../../context/TodosContext';

export const ErrorsContainer = () => {
  const { errorMessage, setErrorMessage } = useTodosContext();

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
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
