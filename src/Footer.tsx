import { useState } from 'react';
import { Todo } from './types/Todo';

type Props = {
  todos: Todo[];
  setVisibleTodos: (todos: Todo[]) => void;
  clearCompletedTodos: () => void;
};

enum Status {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const Footer: React.FC<Props> = ({
  todos,
  setVisibleTodos = () => {},
  clearCompletedTodos = () => {},
}) => {
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const completedTodos = todos.filter((todo) => todo.completed);
  const activeTodos = todos.filter((todo) => !todo.completed);

  const handleFilterChange = (status: Status) => {
    setFilter(status);
    switch (status) {
      case Status.ACTIVE:
        setVisibleTodos(activeTodos);
        break;
      case Status.COMPLETED:
        setVisibleTodos(completedTodos);
        break;
      default:
        setVisibleTodos(todos);
    }
  };

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>
      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === Status.ALL ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === Status.ACTIVE ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterChange(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === Status.COMPLETED ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterChange(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 ? (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      ) : (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompletedTodos}
          disabled
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
