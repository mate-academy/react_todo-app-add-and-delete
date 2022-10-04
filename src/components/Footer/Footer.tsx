import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterTypes } from '../../types/FilterTypes';

  type Props = {
    filteredTodos: Todo[]
    handleFilterType: (type: string) => void
    filterType: string
    clearTable: () => void
  };

export const Footer: React.FC<Props> = ({
  handleFilterType,
  filterType,
  filteredTodos,
  clearTable,
}) => {
  const completedTodosLen = filteredTodos
    .filter(todo => todo.completed === true).length === 0;

  const unCompletedTodosLen = filteredTodos
    .filter(todo => todo.completed === false).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${unCompletedTodosLen} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterTypes.All,
          })}
          onClick={() => handleFilterType(FilterTypes.All)}
        >
          {FilterTypes.All}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterTypes.Active,
          })}
          onClick={() => handleFilterType(FilterTypes.Active)}
        >
          {FilterTypes.Active}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterTypes.Completed,
          })}
          onClick={() => handleFilterType(FilterTypes.Completed)}
        >
          {FilterTypes.Completed}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': completedTodosLen,
        })}
        onClick={clearTable}
      >
        Clear completed
      </button>
    </footer>
  );
};
