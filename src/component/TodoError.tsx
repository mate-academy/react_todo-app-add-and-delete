import { useContext } from 'react';
import { TodosContext } from '../TodosProvider/TodosProvider';
import classNames from 'classnames';

export const TodoError: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className={classNames('delete')}
        onClick={() => setErrorMessage('')}
      />

      {errorMessage && errorMessage}
    </div>
  );
};
