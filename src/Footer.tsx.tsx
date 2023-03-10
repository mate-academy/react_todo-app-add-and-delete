import classnames from 'classnames';
import React from 'react';
import { Todo } from './types/Todo';
import { FilteredBy } from './types/FilteredBy';

type Props = {
  todosToShow: Todo[],
  todoStatus: string,
  setTodoStatus: (todoStatus: FilteredBy) => void,
  onDeleteCompleted: () => void
};

export const Footer: React.FC<Props> = ({
  todosToShow,
  todoStatus,
  setTodoStatus,
  onDeleteCompleted,
}) => {
  const activeTodosLeft = todosToShow.filter(todo => !todo.completed);
  const completedTodos = todosToShow.filter(todo => todo.completed);

  const filtersName = Object.values(FilteredBy);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosLeft.length} items left`}
      </span>

      <nav className="filter">
        {filtersName.map(filterLink => (
          <a
            key={filterLink}
            href={filterLink === FilteredBy.ALL ? ('#/') : (`#/${filterLink}"`)}
            className={classnames(
              'filter__link',
              { selected: todoStatus === filterLink },
            )}
            onClick={() => setTodoStatus(filterLink)}
          >
            {filterLink}
          </a>
        ))}
      </nav>
      {completedTodos.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
