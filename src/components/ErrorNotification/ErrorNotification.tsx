import cn from 'classnames';
import { ErrorStatus } from '../../types/ErrorStatus';
import { useContext } from 'react';
import { TodosContext } from '../todosContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

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
        onClick={() => setErrorMessage(ErrorStatus.NoError)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
