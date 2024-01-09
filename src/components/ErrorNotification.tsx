import classNames from 'classnames';
import { useContext } from 'react';
import { TodosContext } from './TodosContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="CloseMessage"
        onClick={() => setErrorMessage('')}
      />
    </div>
  );
};
