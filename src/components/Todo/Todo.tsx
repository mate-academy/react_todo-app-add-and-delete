import cn from 'classnames';
// import { useState } from 'react';
import { TodoType } from '../../types/Todo';
import { useTodosContext } from '../../providers/TodosProvider/TodosProvider';

type TodoProps = {
  todo: TodoType,
};

export const Todo = ({ todo }: TodoProps) => {
  const { editTodo, delTodo, uploading } = useTodosContext();

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
          checked={todo.completed}
          onChange={() => editTodo({
            ...todo,
            completed: !todo.completed,
          })}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => delTodo(todo)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': uploading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
