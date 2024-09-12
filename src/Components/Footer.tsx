import classNames from 'classnames';
import { FilterType } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

type Props = {
  filterType: FilterType;
  todos: Todo[];
  setFilterType: (filterType: FilterType) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterType,
  todos,
  setFilterType,
  handleClearCompleted,
}) => {
  const disableClearButton = todos.filter(todo => todo.completed).length === 0;
  const handleFilterClick = (type: FilterType) => {
    setFilterType(type);
  };

  const filterOrder = [FilterType.All, FilterType.Active, FilterType.Completed];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        {filterOrder.map((type, index) => (
          <a
            key={index}
            href={`#/${type}`}
            className={classNames('filter__link', {
              selected: filterType === type,
            })}
            data-cy={`FilterLink${type}`}
            onClick={() => handleFilterClick(type)}
          >
            {type}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={disableClearButton}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
