import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoErrors } from '../../types/Errors';

type Props = {
  todo: Todo;
  onRemoveTodo?: (todoId: number) => void;
  onCheckedTodo?: (todoId: number) => void;
  loading: boolean | undefined;
  handleImputTodo?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: TodoErrors | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  onCheckedTodo,
  loading,
  handleImputTodo,
  error,
}) => {
  const { id, completed, title } = todo;

  const [activeRenameTodo, setActiveRenameTodo] = useState<boolean>(false);

  const handleTargetTodo = (todoId: number) => {
    setActiveRenameTodo(id === todoId);
  };

  return (
    <>
      <div className={`todo ${completed && 'completed'}`}>
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onChange={() => onCheckedTodo && onCheckedTodo(id)}
          />
        </label>

        {activeRenameTodo
          ? (
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={handleImputTodo}
            />
          )
          : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => handleTargetTodo(id)}
              >
                {title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => onRemoveTodo && onRemoveTodo(id)}
              >
                ×

              </button>

              {!error?.length && loading && (
                <div className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              )}
            </>
          )}
      </div>
    </>
  );
};
