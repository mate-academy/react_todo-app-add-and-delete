import cn from 'classnames';
import { Filter } from '../types/Filters';
import { Todo } from '../types/Todo';

type Props = {
  active: Todo[];
  complete: Todo[];
  setFilter: (filter: Filter) => void;
  filter: Filter;
  deleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  setFilter,
  filter,
  active,
  complete,
  deleteCompleted,
}) => {
  const handleAllChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setFilter(Filter.all);
  };

  const handleActiveChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setFilter(Filter.active);
  };

  const handleCompletedChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setFilter(Filter.completed);
  };

  return (
    // {/* Hide the footer if there are no todos */}
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {active.length === 1 ? '1 item left' : `${active.length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === Filter.all })}
          data-cy="FilterLinkAll"
          onClick={handleAllChange}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === Filter.active })}
          data-cy="FilterLinkActive"
          onClick={handleActiveChange}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleCompletedChange}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={complete.length === 0}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
