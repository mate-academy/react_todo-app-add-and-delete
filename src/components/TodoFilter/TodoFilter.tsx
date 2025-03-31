import classNames from 'classnames';
import { FilterOption } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterField: FilterOption;
  onFilter: (filter: FilterOption) => void;
  onClearCompleted: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  filterField,
  onFilter,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterField === FilterOption.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilter(FilterOption.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterField === FilterOption.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilter(FilterOption.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterField === FilterOption.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilter(FilterOption.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={activeTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
