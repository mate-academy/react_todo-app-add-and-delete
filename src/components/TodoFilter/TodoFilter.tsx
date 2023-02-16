import cn from 'classnames';
import React from 'react';
import { FilterBy } from '../../types/Filter';

type Props = {
  filter: string,
  filterTodos: (filter: FilterBy) => void,
  removeCompletedTodos: () => void,
  renderClearCompleted: boolean,
  completedTodoIds: number[],
  todoIdsToRemove: number[],
  setTodoIdsToRemove: (n: number[]) => void,
};

export const TodoFilter: React.FC<Props> = ({
  filter,
  filterTodos,
  removeCompletedTodos,
  renderClearCompleted,
  completedTodoIds,
  todoIdsToRemove,
  setTodoIdsToRemove,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        3 items left
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filter === FilterBy.all },
          )}
          onClick={() => filterTodos(FilterBy.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filter === FilterBy.active },
          )}
          onClick={() => filterTodos(FilterBy.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filter === FilterBy.completed },
          )}
          onClick={() => filterTodos(FilterBy.completed)}
        >
          Completed
        </a>
      </nav>

      {renderClearCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            setTodoIdsToRemove([...todoIdsToRemove, ...completedTodoIds]);
            removeCompletedTodos();
          }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
