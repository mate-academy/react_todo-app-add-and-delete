import React, { FC } from 'react';
import cn from 'classnames';
import { Filters } from '../../types/Filters';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodosNumber: number,
  removeCompleted: () => void,
  selectedStatus: Filters,
  setSelectedStatus: (selectedStatus: Filters) => void,
  completedTodos: Todo[],
};

export const Filter: FC<Props> = React.memo((props) => {
  const {
    selectedStatus,
    setSelectedStatus,
    activeTodosNumber,
    removeCompleted,
    completedTodos,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosNumber} item${activeTodosNumber !== 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            {
              selected: selectedStatus === Filters.All,
            },
          )}
          onClick={() => setSelectedStatus(Filters.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            {
              selected: selectedStatus === Filters.Active,
            },
          )}
          onClick={() => setSelectedStatus(Filters.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            {
              selected: selectedStatus === Filters.Completed,
            },
          )}
          onClick={() => setSelectedStatus(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={removeCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
