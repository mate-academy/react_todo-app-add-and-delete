import classNames from 'classnames';
import { Filter, Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  filter: string,
  onSetFilter: (filter: string) => void,
  onSetClearHandler: (selectedTodosId: number) => void
  completedTodos: Todo[],
};

export const Footer: React.FC<Props> = ({
  todos,
  onSetFilter,
  filter,
  onSetClearHandler,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.filter((todo) => !todo.completed).length} items left`}
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
          completedTodos.forEach((todo) => {
            onSetClearHandler(todo.id);
          });
        }}
        style={{
          visibility: completedTodos.length
            ? ('visible')
            : ('hidden'),
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
