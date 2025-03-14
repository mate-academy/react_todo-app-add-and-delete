import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

type Props = {
  status: TodoStatus;
  handleStatusChange: (status: TodoStatus) => void;
  todos: Todo[];
  deleteThisTodo: (todoId: number) => void;
  handleCheckedChange: (todoId: number) => void;
  isChecked: boolean;
  notCompletedTodos: number;
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  handleStatusChange,
  status,
  deleteThisTodo,
  notCompletedTodos,
}) => {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    value: TodoStatus,
  ) => {
    e.preventDefault();
    handleStatusChange(value);
  };

  const isCompleted = todos.some(todo => todo.completed);

  const clearCompletedTodos = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => deleteThisTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatus).map(statusOption => (
          <a
            key={statusOption}
            className={classNames('filter__link', {
              selected: status === statusOption,
            })}
            data-cy={`FilterLink${statusOption}`}
            onClick={e => handleClick(e, statusOption)}
          >
            {statusOption}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!isCompleted}
        style={{
          visibility: isCompleted ? 'visible' : 'hidden',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
