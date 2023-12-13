import cn from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

interface Props {
  todosFromServer: Todo[];
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
}

export const Footer = ({
  todosFromServer,
  selectedFilter,
  setSelectedFilter,
  clearCompleted,
}: Props) => {
  const AmountOfTodosToComplete = todosFromServer.reduce(
    (sum, todo) => sum + +!todo.completed,
    0,
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${AmountOfTodosToComplete} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosFromServer.every(todo => !todo.completed)}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
