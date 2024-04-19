import { useContext } from 'react';
import { TodosContext } from '../TodosProvider/TodosProvider';
import classNames from 'classnames';

export const TodoError: React.FC = () => {
  const { errorMessage } = useContext(TodosContext);

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
      />
      {errorMessage === 'Unable to load todos' && 'Unable to load todos'}
      <br />
      {errorMessage === 'Title should not be empty' &&
        'Title should not be empty'}
      <br />
      {errorMessage === 'Unable to add a todo' && 'Unable to add a todo'}
      <br />
      {errorMessage === 'Unable to delete a todo' && 'Unable to delete a todo'}
      <br />
      {errorMessage === 'Unable to update a todo' && 'Unable to update a todo'}
    </div>
  );
};
