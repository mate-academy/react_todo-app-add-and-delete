import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const isAnyTodosCompleted = todos.some(todo => todo.completed);
  const countOfUncompleted = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countOfUncompleted} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(Filter).map(([key, value]) => {
          return (
            <a
              key={key}
              href="#/"
              className={cn('filter__link', { selected: filter === value })}
              data-cy={`FilterLink${key}`}
              onClick={() => onFilterChange(value)}
            >
              {key}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyTodosCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
