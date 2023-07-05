import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo
  onRemoveTodo: (todoId: number) => void
  onCheckedTodo: (todoId: number) => void
  loading: boolean
  handleImputTodo: (e: React.ChangeEvent<HTMLInputElement>) => void

};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  onCheckedTodo,
  loading,
  handleImputTodo,
}) => {
  const [activeRenameTodo, setActiveRenameTodo] = useState<boolean>(false);

  const handleTargetTodo = (
    todoId: number,
  ) => {
    setActiveRenameTodo(() => todo.id === todoId);
  };

  return (
    <>
      <div
        key={todo.id}
        className={`todo ${todo.completed && 'completed'}`}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onChange={() => onCheckedTodo(todo.id)}
          />
        </label>

        {activeRenameTodo
          ? (
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todo.title}
              onChange={handleImputTodo}
            />
          )
          : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => handleTargetTodo(todo.id)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => onRemoveTodo(todo.id)}
              >
                ×
              </button>

              {loading && (
                <div className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              ) }
            </>
          )}

      </div>
    </>
  );
};
