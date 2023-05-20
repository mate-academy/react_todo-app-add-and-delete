import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/types/Todo';
import { TodoStatus } from '../../types/types/TodoStatus';

type Props = {
  todos: Todo[],
  setTodoStatus: (status: TodoStatus) => void,
  todoStatus: TodoStatus,
  handleDeleteTodo: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodoStatus,
  todoStatus,
  handleDeleteTodo,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>
      <nav className="filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: todoStatus === TodoStatus.ALL,
            },
          )}
          onClick={() => setTodoStatus(TodoStatus.ALL)}
        >
          All
        </a>
        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: todoStatus === TodoStatus.ACTIVE,
            },
          )}
          onClick={() => setTodoStatus(TodoStatus.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: todoStatus === TodoStatus.COMPLETED,
            },
          )}
          onClick={() => setTodoStatus(TodoStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': todos.every(todo => !todo.completed),
        })}
        onClick={handleDeleteTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
