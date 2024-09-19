import cn from 'classnames';
import { FILTER } from '../../types/Filter';

type Props = {
  setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
  selectedStatus: string;
  completedTodosCount: number;
  activeTodosCount: number;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  setSelectedStatus,
  selectedStatus,
  completedTodosCount,
  activeTodosCount,
  deleteCompletedTodos,
}) => {
  const handleFilterClick = (filter: string) => {
    setSelectedStatus(filter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FILTER).map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: selectedStatus === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosCount}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
