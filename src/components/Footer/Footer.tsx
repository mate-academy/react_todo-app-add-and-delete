import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { Filter } from '../../types/filter';

interface Props {
  todos: Todo[];
  filtered: string;
  setFiltered: (b: Filter) => void;
  clearCompleted: () => void;
}

export const Footer = ({
  todos,
  filtered,
  setFiltered,
  clearCompleted,
}: Props) => {
  const todoLength = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {/* Hide the footer if there are no todos */}
      <span className="todo-count" data-cy="TodosCounter">
        {`${todoLength} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filtered === Filter.all })}
          data-cy="FilterLinkAll"
          onClick={() => setFiltered(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filtered === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFiltered(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filtered === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFiltered(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        disabled={todos.every(todo => !todo.completed)}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
