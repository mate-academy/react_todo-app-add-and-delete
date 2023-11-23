/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { TodoLoader } from './TodoLoader';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
}) => {
  const handleDeleteTodo = () => {
    deleteTodo((todo.id));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        onClick={handleDeleteTodo}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      <TodoLoader todo={todo} />
    </div>
  );
};
