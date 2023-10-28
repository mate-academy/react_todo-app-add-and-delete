import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';

interface TodoFooterProps {
  todos: Todo[];
  filterChange: (filter: TodoFilter) => void;
  currentFilter: TodoFilter;
}

export const TodoFooter: React.FC<TodoFooterProps> = (
  { todos, filterChange, currentFilter },
) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            {
              selected: currentFilter === TodoFilter.All,
            })}
          data-cy="FilterLinkAll"
          onClick={() => filterChange(TodoFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            {
              selected: currentFilter === TodoFilter.Active,
            })}
          data-cy="FilterLinkActive"
          onClick={() => filterChange(TodoFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            {
              selected: currentFilter === TodoFilter.Completed,
            })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterChange(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {/* <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button> */
      }
    </footer>
  );
};
