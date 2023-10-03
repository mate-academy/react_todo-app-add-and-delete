import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

import * as postService from '../api/todos';
import { useTodos } from '../hooks/useTodos';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos } = useTodos();

  const deleteTodo = (todoId: number) => {
    postService.removeTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          if (prevTodos) {
            return prevTodos.filter(currentTodo => currentTodo.id !== todoId);
          }

          return null;
        });
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
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
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
