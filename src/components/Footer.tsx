import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface FooterProps {
  activeTodos: Todo[];
  filter: Filter;
  onClick: (filter: Filter) => void;
  hasCompleted: boolean;
  completedTodosIds: number[];
  onClearCompleted: (ids: number[]) => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTodos,
  filter,
  onClick,
  hasCompleted,
  completedTodosIds,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            href={`#/${value !== Filter.All ? value[0].toLowerCase() + value.slice(1) : ''}`}
            className={cn('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => onClick(value)}
            key={value}
          >
            {value}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={() => {
          onClearCompleted(completedTodosIds);
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
