import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type TodoFilterProps = {
  todos: Todo[];
  filterType: FilterType;
  setFilterType: (filterType: FilterType) => void;
  activeTodosCount: number;
  onClearCompleted: () => void;
};

export const TodoFilter: React.FC<TodoFilterProps> = (
  {
    todos,
    filterType,
    setFilterType,
    activeTodosCount,
    onClearCompleted,
  },
) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        {Object.entries(FilterType).map(([key, value]) => (
          <a
            href={`#/${value}`}
            className={classNames('filter__link', {
              selected: value === filterType,
            })}
            onClick={() => setFilterType(value)}
          >
            {key}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: activeTodosCount === todos.length,
        })}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
