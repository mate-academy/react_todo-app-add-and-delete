import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';
import cn from 'classnames';

interface FooterProps {
  todos: Todo[];
  selectedFilter: FilterStatus;
  setSelectedFilter: (selectedFilter: FilterStatus) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(FilterStatus.All)}
        >
          {FilterStatus.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(FilterStatus.Active)}
        >
          {FilterStatus.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(FilterStatus.Completed)}
        >
          {FilterStatus.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
