import { Todo } from '../types/Todo';
import cn from 'classnames';

enum Status {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

type Props = {
  todos: Todo[];
  activeTodos: Todo[];
  statusFilter: Status;
  setStatusFilter: (string: Status) => void;
  clearCompleted: () => void;
};

const FILTERS = [
  { label: 'All', value: Status.all, href: '#/' },
  { label: 'Active', value: Status.active, href: '#/active' },
  { label: 'Completed', value: Status.completed, href: '#/completed' },
] as const;

export const TodoFooter = ({
  activeTodos,
  todos,
  statusFilter,
  setStatusFilter,
  clearCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(filter => (
          <a
            key={filter.value}
            href={filter.href}
            className={cn('filter__link', {
              selected: statusFilter === filter.value,
            })}
            onClick={() => setStatusFilter(filter.value)}
            data-cy={`FilterLink${filter.label}`}
          >
            {filter.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        disabled={!todos.some(todo => todo.completed)}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
