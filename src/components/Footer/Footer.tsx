import cn from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';
import { useContext } from 'react';
import { TodosContext } from '../todosContext';

export const Footer: React.FC = () => {
  const { status, setStatus, todos, deleteChackedTodo } =
    useContext(TodosContext);

  const todosLeft = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    todos.forEach(todo => (todo.completed ? deleteChackedTodo(todo.id) : todo));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === TodoStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === TodoStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === TodoStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
