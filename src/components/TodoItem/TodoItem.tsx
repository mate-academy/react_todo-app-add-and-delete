import React, { useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  todoDeleteButton: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  todoDeleteButton,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const titleField = useRef<HTMLInputElement>(null);

  const hendleStartEditTodo = () => {
    setSelectedTodo(todo);

    setTimeout(() => {
      if (titleField.current !== null) {
        titleField.current.focus();
      }
    }, 0);
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
          checked
        />
      </label>

      {selectedTodo ? (
        <form>
          <input
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={selectedTodo.title}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={hendleStartEditTodo}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => todoDeleteButton(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */ /* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div
          className="
          modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
