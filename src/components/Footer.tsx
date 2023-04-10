import classNames from 'classnames';
import { Todo, Filter } from '../types/Todo';
type Props = {
  activeTodos: Todo[];
  completedTodos: Todo[];
  filter: string;
  onSetFilter: (filter: Filter) => void;
  handleRemoveAll: (selectedTodosId: number) => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  onSetFilter,
  activeTodos,
  completedTodos,
  handleRemoveAll,

}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.ALL },
          )}
          onClick={() => {
            onSetFilter(Filter.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.ACTIVE },
          )}
          onClick={() => {
            onSetFilter(Filter.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.COMPLETED },
          )}
          onClick={() => {
            onSetFilter(Filter.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            completedTodos.forEach(todo => {
              handleRemoveAll(todo.id);
            })
          }}
        >
          Clear completed
        </button>
    </footer>
  );
};


