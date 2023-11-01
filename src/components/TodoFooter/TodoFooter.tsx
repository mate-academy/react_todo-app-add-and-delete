import React, { Dispatch, SetStateAction, useContext } from 'react';
import cn from 'classnames';
import { Status } from '../../types/FilterOptions';
import { TodosContext } from '../TodosContext/TodosContext';

type Props = {
  currentFilter: Status;
  onFilterChange: Dispatch<SetStateAction<Status>>;
};

export const TodoFooter: React.FC<Props> = ({
  currentFilter,
  onFilterChange,
}) => {
  const { todos } = useContext(TodosContext);
  const completedTodos = todos?.filter(todo => todo.completed);
  const notCompletedTodos = todos?.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={cn('filter__link',
            { selected: currentFilter === Status.All })}
          onClick={() => onFilterChange(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={cn('filter__link',
            { selected: currentFilter === Status.Active })}
          onClick={() => onFilterChange(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={cn('filter__link',
            { selected: currentFilter === Status.Completed })}
          onClick={() => onFilterChange(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos?.length
        ? (
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        )
        : (null)}
    </footer>
  );
};
