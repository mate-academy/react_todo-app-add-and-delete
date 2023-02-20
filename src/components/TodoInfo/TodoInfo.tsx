import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ModalOverlay } from '../ModalOverlay';

type Props = {
  todo: Todo;
  removeTodo: (todo: Todo) => void;
  tempTodoId?: number | null;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  tempTodoId,
}) => {
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [inputQuery, setInputQuery] = useState(todo.title);

  const handlerOnBlur = () => {
    setIsTodoEditing(false);
  };

  const {
    completed,
    title,
    id,
  } = todo;

  return (
    <>
      <div
        className={cn('todo', { completed })}
        onDoubleClick={() => setIsTodoEditing(true)}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        {isTodoEditing ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={inputQuery}
              onChange={(event) => setInputQuery(event.target.value)}
              onBlur={handlerOnBlur}
              // eslint-disable-next-line
              autoFocus
            />
          </form>
        )
          : (
            <>
              <span className="todo__title">
                {title}
              </span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => removeTodo(todo)}
              >
                ×
              </button>
            </>
          )}

        <ModalOverlay isTodoUpdated={id === tempTodoId} />
      </div>
    </>
  );
};
