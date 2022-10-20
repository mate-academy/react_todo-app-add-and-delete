import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  deleteCompleted: boolean,
};

export const TodoItem: React.FC<Props> = (
  { todo, removeTodo, deleteCompleted },
) => {
  const [editor, setEditor] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(false);

  useEffect(() => {
    if (deleteCompleted && todo.completed) {
      setIsLoad(true);
    } else {
      setIsLoad(false);
    }
  }, [deleteCompleted]);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [editor]);

  const { title } = todo;

  const remover = async () => {
    setIsLoad(true);
    await removeTodo(todo.id);
    setIsLoad(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {editor
        ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              ref={newTodoField}
              onBlur={() => setEditor(!editor)}
              onDoubleClick={() => setEditor(!editor)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEditor(!editor)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={remover}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoad },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
