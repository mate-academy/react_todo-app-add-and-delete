import classNames from 'classnames';
import { getActiveTodos, getCompletedTodos } from '../services/functions';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filterBy: Filter;
  handleSelect: (filterBy: Filter) => void;
  onDelete: (id: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  handleSelect,
  onDelete,
}) => {
  const clearCompleted = () => {
    const allCompleted = getCompletedTodos(todos);

    return allCompleted.map(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getActiveTodos(todos).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleSelect(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleSelect(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleSelect(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!getCompletedTodos(todos).length}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
