import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  activeTodos: Todo[] | null,
  todoStatus: string, // filter
  setTodoStatus: (value: TodoStatus) => void, // setFilter
  completedTodos: Todo[],
  handleRemoveCompleted: () => void,
};

export const Footer :React.FC<Props> = ({
  activeTodos,
  todoStatus,
  setTodoStatus,
  completedTodos,
  handleRemoveCompleted,
}) => {
  const itemsLeft = activeTodos?.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {Object.values(TodoStatus).map((filter) => (
          <a
            className={cn('filter__link',
              { selected: todoStatus === filter })}
            onClick={() => setTodoStatus(filter)}
            key={filter}
            href={`#/${filter}`}
          >
            {filter}
          </a>
        ))}
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__clear-completed', {
            hidden: completedTodos.length === 0,
          })}
          onClick={handleRemoveCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
