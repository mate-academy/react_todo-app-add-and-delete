import { filters } from '../../constans/filterOptions';
import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  activeTodosAmount: number;
  filterBy: FilterBy;
  setFilterBy: (filter: FilterBy) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  activeTodosAmount,
  filterBy,
  setFilterBy,
  onClearCompleted,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosAmount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ label, value, cy, href }) => (
          <a
            key={value}
            href={href}
            className={`filter__link ${filterBy === value ? 'selected' : ''}`}
            data-cy={cy}
            onClick={e => {
              e.preventDefault();
              setFilterBy(value);
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
