import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  loading?: boolean;
};

const TodoItem: React.FC<Props> = React.memo(({ todo, handleDeleteTodo, loading = false }) => {

  const { id, title, completed } = todo;
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <div data-cy="Todo" className={cn("todo", { "completed": completed })}>
      <label className="todo__status-label" htmlFor={`todo-${id}`}>
        {" "}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          id={`todo-${id}`}
          aria-readonly={true}
          disabled={loading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={
          () => {
            handleDeleteTodo(id);
            setDeleteId(id);
          }}
        disabled={loading}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader"
        className={cn("modal overlay", {
          "is-active": id === 0 && loading || deleteId !== null && loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
});

TodoItem.displayName = 'TodoItem';
export default TodoItem;

