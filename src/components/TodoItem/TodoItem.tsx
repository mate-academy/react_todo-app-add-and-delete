import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ModalOverlay } from '../ModalOverlay';

type Props = {
  todo: Todo;
  removeTodo: (todo: Todo) => void;
  tempTodoId?: number | null;
  updateTodoStatus: (isCompleted: boolean, todo: Todo) => void;
  updateTodoTitle: (title: string, todo: Todo) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  removeTodo,
  tempTodoId,
  updateTodoStatus,
  updateTodoTitle,
  isLoading,
}) => {
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [inputQuery, setInputQuery] = useState(todo.title);
  const [compareInputQuery, setCompareInputQuery] = useState(inputQuery);

  const {
    title,
    id,
    completed,
  } = todo;

  useEffect(() => {
    setCompareInputQuery(compareInputQuery);
  }, [todo]);

  const checkIsNeedQueryUpdated = () => {
    if (!inputQuery) {
      removeTodo(todo);

      return;
    }

    if (inputQuery !== compareInputQuery) {
      updateTodoTitle(inputQuery, todo);
    }

    setIsTodoEditing(false);
  };

  const handlerOnBlur = () => {
    checkIsNeedQueryUpdated();
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    checkIsNeedQueryUpdated();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsTodoEditing(false);
      setInputQuery(compareInputQuery);
    }
  };

  const toggleStatus = () => {
    updateTodoStatus(!todo.completed, todo);
  };

  return (
    <>
      <div
        className={classNames('todo', { completed })}
        onDoubleClick={() => setIsTodoEditing(true)}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={toggleStatus}
          />
        </label>

        {isTodoEditing ? (
          <form onSubmit={handlerSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={inputQuery}
              onChange={(event) => setInputQuery(event.target.value)}
              onKeyUp={(event) => handleKeyUp(event)}
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
                x
              </button>
            </>
          )}

        {isLoading && (
          <ModalOverlay isTodoUpdated={id === tempTodoId} />
        )}
      </div>
    </>
  );
});
