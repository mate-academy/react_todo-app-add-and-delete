import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  selectedFilter: FilterType;
  handleFilterChange: (filter: FilterType) => void;
  isCompleted: boolean;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  selectedFilter,
  handleFilterChange,
  isCompleted,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        3 items left
      </span>

      <nav className="filter">
        {(Object.keys(FilterType) as Array<FilterType>).map(type => {
          return (
            <a
              key={type}
              href="#/"
              className={cn(
                'filter__link',
                { selected: selectedFilter === type },
              )}
              onClick={() => handleFilterChange(type)}
            >
              {type}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className={cn(
          'todoapp__clear-completed',
          { hidden: !isCompleted },
        )}
        onClick={deleteCompletedTodos}
      >
        Clear compleated
      </button>

    </footer>
  );
};
