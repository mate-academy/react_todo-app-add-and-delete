import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { SortTypes } from '../../types/SortTypes';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  activeFilter: SortTypes;
  onChangeFilter: (filter: SortTypes) => void;
  onClearCompletedTodos: () => void;
}

export const Nav: FC<Props> = ({
  todos,
  activeFilter,
  onChangeFilter,
  onClearCompletedTodos,
}) => {
  const [hasCompletedTodo, setHasCompletedTodo] = useState(false);

  const handleFilter = (filter: SortTypes) => {
    onChangeFilter(filter);
  };

  useEffect(() => {
    const hasCompleted = todos.some(todo => todo.completed);

    setHasCompletedTodo(hasCompleted);
  }, [todos]);

  return (
    <>
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: activeFilter === SortTypes.All })}
          onClick={() => handleFilter(SortTypes.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: activeFilter === SortTypes.Active })}
          onClick={() => handleFilter(SortTypes.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: activeFilter === SortTypes.Completed })}
          onClick={() => handleFilter(SortTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompletedTodos}
        disabled={!hasCompletedTodo}
        style={{ visibility: hasCompletedTodo ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>

    </>
  );
};
