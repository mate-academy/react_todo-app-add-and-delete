import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodoHandler: (id: number) => void;
  tempTodo: Todo | null;
  deletedTodoId: Todo | undefined;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodoHandler,
  tempTodo,
  deletedTodoId,
}) => {
// console.log('todo.id', todo.id);
// console.log('deletedTodoId.id', deletedTodoId.id);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
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
        onClick={() => {
          deleteTodoHandler(todo.id);
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === tempTodo?.id
          || deletedTodoId?.id === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
