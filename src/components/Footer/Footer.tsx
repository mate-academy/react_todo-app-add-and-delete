import cn from 'classnames';
import { filterOptions } from '../../constants/filterOptions';
import { FilterOptions } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';

type Props = {
  incompleteTodosCount: number;
  onSelectFilter: React.Dispatch<React.SetStateAction<FilterOptions>>;
  selectedFilter: FilterOptions;
  completedTodos: Todo[];
  onDeleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  incompleteTodosCount,
  onSelectFilter,
  selectedFilter,
  completedTodos,
  onDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {incompleteTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => (
          <a
            key={option}
            onClick={() => onSelectFilter(option)}
            href={`#/${option === 'All' ? '' : option}`}
            className={cn(
              'filter__link',
              selectedFilter === option && 'selected',
            )}
            data-cy={`FilterLink${option}`}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        onClick={onDeleteCompletedTodos}
        disabled={!completedTodos.length}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
