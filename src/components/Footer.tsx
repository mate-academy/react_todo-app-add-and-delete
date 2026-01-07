import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosFilter } from '../types/enums';

type Props = {
  todos: Todo[];
  currentFilter: TodosFilter;
  handleFilterChange: (filter: TodosFilter) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  currentFilter,
  handleFilterChange,
  handleClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {' '}
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: currentFilter === TodosFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange(TodosFilter.All)}
        >
          {' '}
          All{' '}
        </a>{' '}
        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentFilter === TodosFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterChange(TodosFilter.Active)}
        >
          {' '}
          Active{' '}
        </a>{' '}
        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentFilter === TodosFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterChange(TodosFilter.Completed)}
        >
          {' '}
          Completed{' '}
        </a>{' '}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
