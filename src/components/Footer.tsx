import classNames from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  typeFilter: FilterType;
  setTypeFilter: (typeFilter: FilterType) => void;
  isAllActive: boolean;
  deleteTodoService: (id: number) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  typeFilter,
  setTypeFilter,
  isAllActive,
  deleteTodoService,
}) => {
  const leftTodos = todos.filter(todo => !todo.completed).length;

  function handleDeleteAllCompleted() {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.map(todo => deleteTodoService(todo.id));
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: typeFilter === FilterType.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setTypeFilter(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: typeFilter === FilterType.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setTypeFilter(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: typeFilter === FilterType.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setTypeFilter(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isAllActive}
        onClick={handleDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
