import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todos: Todo[];
  todoStatus: TodoStatus;
  setTodoStatus: (value: TodoStatus) => void;
};

export const Footer :React.FC<Props> = ({
  todos,
  todoStatus,
  setTodoStatus,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;

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

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
