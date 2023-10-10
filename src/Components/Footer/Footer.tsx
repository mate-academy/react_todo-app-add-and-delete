import classNames from 'classnames';
import { FilterType } from '../../utils/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterType;
  setFilterType: (filter: FilterType) => void;
  todos: Todo[] ;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterType,
  setFilterType,
  todos,
  onDeleteCompleted,
}) => {
  const hundleFiltering = (filter: FilterType) => {
    setFilterType(filter);
  };

  const todosCounter = todos.filter(todo => !todo.completed).length;

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span data-cy="TodosCounter" className="todo-count">
        {`${todosCounter} items left`}
      </span>

      <nav data-cy="Filter" className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => hundleFiltering(FilterType.All)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => hundleFiltering(FilterType.Active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => hundleFiltering(FilterType.Completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
