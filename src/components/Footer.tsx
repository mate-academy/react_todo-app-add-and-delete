import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

type Props = {
  currentTodos: Todo[];
  todosFilter: FilterType;
  setTodosFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  currentTodos,
  todosFilter,
  setTodosFilter,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {currentTodos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: todosFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setTodosFilter(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: todosFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setTodosFilter(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: todosFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setTodosFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={currentTodos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
