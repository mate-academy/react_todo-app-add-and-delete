import { useContext } from 'react';
import classNames from 'classnames';
import { FilterOption, TodoContext } from '../../context/TodoContext';

export const TodoFooter = () => {
  const {
    filter, setFilter, visibleTodos, activeTodosAmount, clearCompleted,
  } = useContext(TodoContext);

  const completedTodosAmount = visibleTodos.some(todo => todo.completed);

  const handleClearAllCompleted = () => {
    if (completedTodosAmount) {
      clearCompleted();
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosAmount} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          onClick={() => setFilter(FilterOption.all)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          onClick={() => setFilter(FilterOption.active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          onClick={() => setFilter(FilterOption.completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          todoapp__hidden_completed_button: !completedTodosAmount,
        })}
        data-cy="ClearCompletedButton"
        onClick={handleClearAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
