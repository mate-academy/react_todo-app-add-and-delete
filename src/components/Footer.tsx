import classNames from 'classnames';
import { Filter, Todo } from '../types/Todo';

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
}) => {
  const handleClickRemoveAll = () => {
    const selectedTodosIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    onSetClearHandler(selectedTodosIds);
  };

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
      {todos.find((todo) => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClickRemoveAll}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
