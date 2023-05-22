import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

interface Props {
  setFilter: (filter: string) => void;
  clearCompletedTodos: () => void;
  selectedFilter: string;
  comletedTodos: Todo[];
  uncomletedTodoCount: number;
}

export const Footer: React.FC<Props> = ({
  setFilter,
  clearCompletedTodos,
  selectedFilter,
  comletedTodos,
  uncomletedTodoCount,
}) => {
  return (
    <footer className="todoapp__footer">
      {/* Hide the footer if there are no todos */}

      <span className="todo-count">
        {`${uncomletedTodoCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.ALL,
          })}
          onClick={() => {
            setFilter(Filter.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.ACTIVE,
          })}
          onClick={() => {
            setFilter(Filter.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.COMPLETED,
          })}
          onClick={() => {
            setFilter(Filter.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {comletedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
