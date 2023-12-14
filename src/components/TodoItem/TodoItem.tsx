import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

interface TodoItemProps {
  todo: Todo;
  filterTodoList: (todoId: number) => void;
  setErrorMessage: (setErrorMessage: Errors | null) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  filterTodoList,
  setErrorMessage,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteTodo = (todoId: number) => {
    setLoading(true);
    deleteTodo(todoId)
      .then(() => {
        filterTodoList(todoId);
      })
      .catch(() => {
        setErrorMessage(Errors.Delete);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
