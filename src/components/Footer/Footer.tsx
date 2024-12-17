import { Filter } from '../../types/Filter';
import classNames from 'classnames';
// import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filteredField: Filter;
  setFilteredField: (filterName: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filteredField,
  setFilteredField,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filteredField === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilteredField(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filteredField === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilteredField(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filteredField === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilteredField(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
