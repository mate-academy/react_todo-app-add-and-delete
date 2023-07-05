import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  deletingTodoId: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  deletingTodoId,
}) => {
  const isDeletingItem = deletingTodoId.includes(todo.id);

  return (
    <div
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>
      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(todo.id)}
      >
        ×

      </button>

      <div
        className={cn(
          'modal overlay',
          { ' is-active': isDeletingItem },
        )}
      >
        <div className="modal-background has-background-white-ter " />
        <div className="loader " />
      </div>

    </div>
  );
};
