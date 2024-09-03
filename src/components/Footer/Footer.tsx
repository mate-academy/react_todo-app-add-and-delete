import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todosAmount: number;
  filterTodos: Filter;
  completedTodos: Todo[] | undefined;
  setFilterTodos: React.Dispatch<React.SetStateAction<Filter>>;
  deleteCompleted: (completed: Todo[]) => void;
}

export const Footer: React.FC<Props> = ({
  todosAmount,
  filterTodos,
  setFilterTodos,
  completedTodos,
  deleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosAmount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterTodos === Filter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterTodos(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterTodos === Filter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterTodos(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterTodos === Filter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterTodos(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => completedTodos && deleteCompleted(completedTodos)}
        disabled={!completedTodos || completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
