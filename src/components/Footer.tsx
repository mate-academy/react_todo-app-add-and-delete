import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[];
  clearCompleted?: () => void;
  filter: Status;
  setFilter: React.Dispatch<React.SetStateAction<Status>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  clearCompleted,
  filter,
  setFilter,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} item{activeCount !== 1 ? 's' : ''} left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(s => {
          const isSelected = filter === s;
          const href = s === Status.All ? '#/' : `#/${s.toLowerCase()}`;
          const dataCy = `FilterLink${s}`;

          return (
            <a
              key={s}
              href={href}
              className={`filter__link${isSelected ? ' selected' : ''}`}
              data-cy={dataCy}
              onClick={e => {
                e.preventDefault();
                setFilter(s);
              }}
            >
              {s}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={() => {
          if (clearCompleted) {
            clearCompleted();
          }
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
