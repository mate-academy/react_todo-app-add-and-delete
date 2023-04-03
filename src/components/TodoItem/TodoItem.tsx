import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import { ErrorsMessages } from '../../types/ErrorsMessages';

type Props = {
  todo: Todo,
  handleChecker: (id: number, data: Partial<Todo>) => void,
  removeTodo: (id: number) => void,
  processings: number[],
  errorMessage: (message: ErrorsMessages) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleChecker,
  removeTodo,
  processings,
  errorMessage,
}) => {
  const { id, completed, title } = todo;
  const [isFormActive, setIsFormActive] = useState(false);
  const [inputValue, setInputValue] = useState(title);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setInputValue(event.target.value);
  };

  const validateTitle = () => {
    if (!inputValue.trim().length) {
      removeTodo(id);
      errorMessage(ErrorsMessages.Title);

      return false;
    }

    if (title === inputValue.trim()) {
      setIsFormActive(false);

      return false;
    }

    setIsFormActive(false);

    return true;
  };

  const changeTodoTitle = () => {
    return validateTitle() ? (
      handleChecker(id, { title: inputValue })
    ) : (
      null
    );
  };

  const moveCursorToEndOfInput = (e: React.FocusEvent<HTMLInputElement>) => (
    e.currentTarget.setSelectionRange(
      e.currentTarget.value.length,
      e.currentTarget.value.length,
    )
  );

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    changeTodoTitle();
  }

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChecker(id, { completed: !completed })}
        />
      </label>

      {isFormActive ? (
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onChange={(event) => handleChange(event)}
            onBlur={() => changeTodoTitle()}
            ref={ref => ref && ref.focus()}
            onFocus={(e) => moveCursorToEndOfInput(e)}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={() => setIsFormActive(true)}
        >
          {title}
        </span>
      )}
      {isFormActive || (
        <button
          type="button"
          className="todo__remove"
          onClick={() => removeTodo(id)}
        >
          ×
        </button>
      )}

      <Loader
        isActive={processings.includes(todo.id)}
      />
    </div>
  );
};
