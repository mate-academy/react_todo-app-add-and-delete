import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => Promise<void>;
  isDeletingTodo: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    deleteTodo,
    isDeletingTodo,
  }) => {
    const isLoading = todo.id === 0 || isDeletingTodo;

    return (
      <div
        data-cy="Todo"
        className={cn(
          'todo',
          { completed: todo.completed },
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
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn(
            'modal',
            'overlay',
            { 'is-active': isLoading },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
