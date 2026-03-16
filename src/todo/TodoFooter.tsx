import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterOption } from '../App';

type Props = {
  todos: Todo[];
  filterOption: FilterOption;
  setFilterOption: (a: FilterOption) => void;
  clearCompleted: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterOption,
  setFilterOption,
  clearCompleted,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const hasCompleted = completedTodos.length > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterOption === FilterOption.default,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterOption(FilterOption.default)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterOption === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterOption(FilterOption.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterOption === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterOption(FilterOption.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!hasCompleted}
        style={{ visibility: hasCompleted ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
