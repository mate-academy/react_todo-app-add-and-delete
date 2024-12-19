import classNames from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  activeTodosCount: number;
  completedTodos: Todo[];
  filterType: FilterType;
  setFilterType: (selectedOption: FilterType) => void;
  onClearcompleted: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filterType,
  completedTodos,
  setFilterType,
  onClearcompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filter => (
          <a
            href={`#/${filter === FilterType.All ? '' : filter.toLowerCase()}`}
            key={filter}
            className={classNames('filter__link', {
              selected: filterType === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterType(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={onClearcompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
