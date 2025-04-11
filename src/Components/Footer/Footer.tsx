import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  activeTodos: number;
  setFilter: (filter: Filter) => void;
  currentFilter: Filter;
  hasCompletedTodos: boolean;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  setFilter,
  currentFilter,
  hasCompletedTodos,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(f => (
          <a
            key={f}
            href={`#/${f.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: currentFilter === f,
            })}
            data-cy={`FilterLink${f}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
