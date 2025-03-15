import { Todo } from '../../types/Todo';
import { FILTER, Filter } from '../../types/Filter';
import classNames from 'classnames';
import { ErrorType } from '../../types/Error';

type Props = {
  todos: Todo[];
  filter: Filter;
  setFilter: (value: Filter) => void;
  setTodos: (todos: Todo[]) => void;
  setErrorType: (error: ErrorType) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
}) => {
  let uncompletedTodosCounter = 0;
  const allFilterCN = classNames('filter__link', {
    selected: filter === FILTER.all,
  });
  const activeFilterCN = classNames('filter__link', {
    selected: filter === FILTER.active,
  });
  const completedFilterCN = classNames('filter__link', {
    selected: filter === FILTER.completed,
  });

  todos.forEach(todo => {
    if (!todo.completed) {
      uncompletedTodosCounter++;
    }
  });
  const completedTodosCounter = todos.length - uncompletedTodosCounter;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => setFilter(FILTER.all)}
          href="#/"
          className={allFilterCN}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={() => setFilter(FILTER.active)}
          href="#/active"
          className={activeFilterCN}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={() => setFilter(FILTER.completed)}
          href="#/completed"
          className={completedFilterCN}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        onClick={clearCompleted}
        disabled={completedTodosCounter === 0}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
