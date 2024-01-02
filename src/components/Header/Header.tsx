import classNames from 'classnames';
import { useTodos } from '../../context';
import { AddTodoForm } from '../AddTodoForm';

export const Header = () => {
  const { inProgress } = useTodos();

  const handleCompleteTodos = () => {
    // eslint-disable-next-line spaced-comment
    //thirf part of Todos tasks
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="Add Todo"
        className={classNames(
          'todoapp__toggle-all',
          { active: inProgress },
        )}
        disabled={!inProgress}
        data-cy="ToggleAllButton"
        onClick={handleCompleteTodos}
      />

      <AddTodoForm />
    </header>
  );
};
