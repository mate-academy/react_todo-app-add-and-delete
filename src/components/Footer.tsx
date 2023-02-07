import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  filter: string,
  onSetFilter: (filter: string) => void,
  onSetClearHandler: (selectedTodosIds: number[]) => void
};

export const Footer: React.FC<Props> = ({
  todos,
  onSetFilter,
  filter,
  onSetClearHandler,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${todos.filter((todo) => !todo.completed).length} items left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filter === 'all' },
        )}
        onClick={() => {
          onSetFilter('all');
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filter === 'active' },
        )}
        onClick={() => {
          onSetFilter('active');
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filter === 'completed' },
        )}
        onClick={() => {
          onSetFilter('completed');
        }}
      >
        Completed
      </a>
    </nav>
    {todos.find((todo) => todo.completed) && (
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => {
          const selectedTodosIds = todos
            .filter((todo) => todo.completed)
            .map((todo) => todo.id);

          onSetClearHandler(selectedTodosIds);
        }}
      >
        Clear completed
      </button>
    )}
  </footer>
);
