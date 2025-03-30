import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  filter: string;
  onFilter: (v: string) => void;
  activeTodosCount: number;
  complitedTodos: Todo[];
  onDelete: (v: number) => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  onFilter,
  activeTodosCount,
  complitedTodos,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => onFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === 'active' })}
          data-cy="FilterLinkActive"
          onClick={() => onFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: filter === 'completed' })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!complitedTodos.length}
        onClick={() => {
          complitedTodos.map(todo => {
            onDelete(todo.id);
          });
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
