import cn from 'classnames';
import { Filter, Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  currentFilter: string;
  handleClearCompleted: () => void;
  setFilter: (filter: Filter) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  currentFilter,
  handleClearCompleted,
  setFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => (
          <a
            href={`#/${filter}`}
            key={filter}
            className={cn('filter__link', {
              selected: filter === currentFilter,
            })}
            onClick={() => setFilter(filter)}
            data-cy={`FilterLink${filter}`}
          >
            {filter}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
