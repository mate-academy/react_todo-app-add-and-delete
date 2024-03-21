import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../constants/userdata';
import { EMPTY_TITLE_ERROR } from '../../constants/errordata';

type Props = {
  todos: Todo[];
  inputText: string;
  tempTodo: Todo | null;
  setInputText: (value: string) => void;
  setErrorMessage: (value: string) => void;
  createTodoHandler: (newTodo: Omit<Todo, 'id'>) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  inputText,
  tempTodo,
  setInputText,
  setErrorMessage,
  createTodoHandler,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  const handleError = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputText.trim()) {
      handleError(EMPTY_TITLE_ERROR);

      return;
    }

    if (inputText.trim().length > 0) {
      const newTodoTemplate = {
        userId: USER_ID,
        title: inputText.trim(),
        completed: false,
      };

      createTodoHandler(newTodoTemplate);
    }
  };

  useEffect(() => {
    titleField.current?.focus();
  }, [todos, tempTodo]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={titleField}
          value={inputText}
          data-cy="NewTodoField"
          disabled={tempTodo !== null}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setInputText(event.target.value)}
        />
      </form>
    </header>
  );
};
