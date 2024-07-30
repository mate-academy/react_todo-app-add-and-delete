import { Todo } from '../types/Todo';
import { Filters } from './Filters';
import { countActiveTodos } from '../utils/countActiveTodos';

import cn from 'classnames';

type Props = {
  todos: Todo[];
  setFilter: (filterBy: Filters) => void;
  onDelete: (id: number) => void;
  filter: Filters;
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
            selected: filter === Filters.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filters.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filters.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filters.Completed)}
        >
          Completed
        </a>
      </nav>
      {todos.some(todo => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() => {
            todos
              .filter(todo => todo.completed)
              .forEach(todo => onDelete(todo.id));
          }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
