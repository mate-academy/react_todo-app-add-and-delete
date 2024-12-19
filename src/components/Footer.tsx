import React from 'react';
import cn from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filteredStatus: Status;
  onFilteredStatus: (stat: Status) => void;
  todosCount: number;
  isDeleteCompleted: boolean;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = props => {
  const {
    todos,
    filteredStatus,
    onFilteredStatus,
    todosCount,
    isDeleteCompleted,
    onDeleteCompleted,
  } = props;

  const allStatus = Object.values(Status);
  const isCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {allStatus.map(stat => (
          <a
            key={stat}
            href={`#/${stat !== Status.All ? stat.toLowerCase() : ''}`}
            className={cn('filter__link', {
              selected: stat === filteredStatus,
            })}
            data-cy={`FilterLink${stat}`}
            onClick={() => onFilteredStatus(stat)}
          >
            {stat}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDeleteCompleted || !isCompleted}
        style={{ visibility: !isCompleted ? 'hidden' : 'visible' }}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
