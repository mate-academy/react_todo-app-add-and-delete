import classNames from 'classnames';
import { TodoType } from '../../types/TodoType';

export enum FilterType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

const fitlerTypes = [
  { id: 1, type: FilterType.All },
  { id: 2, type: FilterType.Active },
  { id: 3, type: FilterType.Completed },
];

type Props = {
  onFilterType: (newFilterType: FilterType) => void;
  onRemoveComletedTodos: () => void;
  selectedFilterType: FilterType;
  itemsLeft: TodoType[];
  completedTodos: number;
};

export const Footer: React.FC<Props> = ({
  onFilterType,
  onRemoveComletedTodos,
  selectedFilterType,
  itemsLeft,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft.length} items left`}
      </span>
      <nav className="filter">
        {fitlerTypes.map(filterType => (
          <li key={filterType.id} style={{ listStyle: 'none' }}>
            <a
              href="#/"
              className={classNames(
                'filter__link',
                { selected: selectedFilterType === filterType.type },
              )}
              onClick={() => onFilterType(filterType.type)}
            >
              {filterType.type}
            </a>
          </li>
        ))}
      </nav>
      {completedTodos ? (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onRemoveComletedTodos}
        >
          Clear completed
        </button>
      ) : (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onRemoveComletedTodos}
          style={{ visibility: 'hidden' }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
