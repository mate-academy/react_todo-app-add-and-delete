import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

enum Sorting {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type Props = {
  todos: Todo[],
  setVisibleTodos: (visTodos: Todo[]) => void,
  todosCount: number,
  onRemove: () => void,
  complitedTodos: number[],
};

export const Footer: React.FC<Props> = ({
  todos,
  setVisibleTodos,
  todosCount,
  onRemove,
  complitedTodos,
}) => {
  const [sortBy, setSortBy] = useState<Sorting>(Sorting.All);

  const handleSorting = () => {
    let visibleTodos = todos;

    switch (sortBy) {
      case Sorting.Active:
        visibleTodos = todos.filter(todo => !todo.completed);

        break;
      case Sorting.Completed:
        visibleTodos = todos.filter(todo => todo.completed);

        break;
      default:
        visibleTodos = todos;
    }

    setVisibleTodos(visibleTodos);
  };

  useEffect(() => handleSorting(), [sortBy, todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortBy === Sorting.All },
          )}
          onClick={() => setSortBy(Sorting.All)}
        >
          {Sorting.All}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortBy === Sorting.Active },
          )}
          onClick={() => setSortBy(Sorting.Active)}
        >
          {Sorting.Active}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortBy === Sorting.Completed },
          )}
          onClick={() => setSortBy(Sorting.Completed)}
        >
          {Sorting.Completed}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed_disabled': complitedTodos.length === 0 },
        )}
        onClick={onRemove}
        disabled={complitedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
