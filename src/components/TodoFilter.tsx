import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { countActiveTodos } from '../utils/countActiveTodos';

import cn from 'classnames';

type Props = {
  todos: Todo[];
  setFilter: (filterBy: Filter) => void;
  onDelete: (id: number) => void;
  filter: Filter;
};

export const TodoFilter: React.FC<Props> = ({
  filter,
  setFilter,
  onDelete,
  todos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos(todos).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.length - countActiveTodos(todos).length === 0}
        onClick={() => {
          todos
            .filter(todo => todo.completed)
            .forEach(todo => onDelete(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
