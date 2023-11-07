import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onSetFilter: (v: Filter) => void,
  filter: Filter,
};

export const Footer: React.FC<Props> = ({ onSetFilter, filter, todos }) => {
  const getSelectedClass = (filterName: Filter) => {
    return filter === filterName ? 'selected' : '';
  };

  const changeFilterHandler = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    filterBy: Filter,
  ) => {
    event.preventDefault();
    onSetFilter(filterBy);
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: getSelectedClass(Filter.All),
          })}
          data-cy="FilterLinkAll"
          onClick={(event) => changeFilterHandler(event, Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: getSelectedClass(Filter.Active),
          })}
          data-cy="FilterLinkActive"
          onClick={(event) => changeFilterHandler(event, Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: getSelectedClass(Filter.Completed),
          })}
          data-cy="FilterLinkCompleted"
          onClick={(event) => changeFilterHandler(event, Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
