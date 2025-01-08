import React from 'react';
import cn from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

interface Props {
  filterType: Status;
  todos: Todo[];
  onFiltered: (filtStatus: Status) => void;
  countTodo: number;
  loadedDelete: boolean;
  loadedDeleteTodo: () => void;
}

export const Footer: React.FC<Props> = props => {
  const {
    filterType,
    todos,
    onFiltered,
    countTodo,
    loadedDelete,
    loadedDeleteTodo,
  } = props;

  const hasLoaded = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countTodo} items left
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href={`#/${filterType !== Status.All ? Status.All.toLowerCase() : ''}`}
          className={cn('filter__link', {
            selected: filterType === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFiltered(Status.All)}
        >
          All
        </a>
        <a
          href={`#/${filterType !== Status.Active ? Status.Active.toLowerCase() : ''}`}
          className={cn('filter__link', {
            selected: filterType === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFiltered(Status.Active)}
        >
          Active
        </a>
        <a
          href={`#/${filterType !== Status.Completed ? Status.Completed.toLowerCase() : ''}`}
          className={cn('filter__link', {
            selected: filterType === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFiltered(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={loadedDelete || !hasLoaded}
        style={{ visibility: !hasLoaded ? 'hidden' : 'visible' }}
        onClick={loadedDeleteTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
