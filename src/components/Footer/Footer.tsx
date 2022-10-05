import cN from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

type Props = {
  onFilterStatus: (s: string) => void,
  onClear: () => void,
  filterStatus: string,
  todos: Todo[],
  completeTodos: Todo[],
};

export const Footer: React.FC<Props> = ({
  onFilterStatus,
  onClear,
  filterStatus,
  todos,
  completeTodos,
}) => {
  const itemsLeft = [...todos.filter(todo => !todo.completed)].length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cN('filter__link',
            { selected: filterStatus === FilterStatus.All })}
          onClick={() => {
            onFilterStatus(FilterStatus.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cN('filter__link',
            { selected: filterStatus === FilterStatus.Active })}
          onClick={() => {
            onFilterStatus(FilterStatus.Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cN('filter__link',
            { selected: filterStatus === FilterStatus.Completed })}
          onClick={() => {
            onFilterStatus(FilterStatus.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={onClear}
      >
        {completeTodos.length > 0 && 'Clear completed'}

      </button>
    </footer>
  );
};
