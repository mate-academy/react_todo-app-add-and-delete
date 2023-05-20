import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => void,
  processingTodosIds: number[],
  updateTodo: (id: number, data: Partial<Todo>) => void
};

export const ToDoInfo: React.FC<Props> = ({
  todo,
  deleteTodo,
  processingTodosIds,
  updateTodo,
}) => {
  const { title, completed, id } = todo;

  const [todoTitle, setTodoTitle] = useState(title);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const processingTodosIdss = processingTodosIds.includes(id);
  const todoTitleField = useRef<HTMLInputElement>(null);

  const handleOnBlur = () => {
    if (!todoTitle.length) {
      deleteTodo(id);
    }

    if (title !== todoTitle && todoTitle.length > 0) {
      updateTodo(id, { title: todoTitle });
    }

    setIsDoubleClicked(false);
  };

  const handlePress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      handleOnBlur();
      setTodoTitle(todoTitle);
      setIsDoubleClicked(false);
    }
  };

  useEffect(() => {
    if (todoTitleField.current !== null) {
      todoTitleField.current.focus();
    }
  }, [isDoubleClicked]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value !== todoTitle) {
      setTodoTitle(value);
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateTodo(id, { completed: !completed })}
        />
      </label>

      { !isDoubleClicked
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsDoubleClicked(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )
        : (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={todoTitleField}
              value={todoTitle}
              onChange={(event) => handleOnChange(event)}
              onBlur={() => handleOnBlur()}
              onKeyDown={(event) => handlePress(event)}
            />
          </form>
        )}

      <div className={classNames('modal overlay',
        { 'is-active': processingTodosIdss })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
