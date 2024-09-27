import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../constants/credentials';
import { TITLE_EMPTY_ERROR } from '../../constants/errors';
import { wait } from '../../utils/fetchClient';

type Props = {
  inputValue: string;
  setInputValue: (value: string) => void;
  createTodoHandler: (newTodo: Omit<Todo, 'id'>) => void;
  setErrorMessage: (error: string) => void;
};

export const Header: React.FC<Props> = ({
  inputValue,
  setInputValue,
  createTodoHandler,
  setErrorMessage,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current != null) {
      titleField.current.focus();
    }
  }, []);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim().length > 0) {
      const newTodoTemplate = {
        userId: USER_ID,
        title: inputValue,
        completed: false,
      };

      createTodoHandler(newTodoTemplate);
    } else {
      setErrorMessage(TITLE_EMPTY_ERROR);

      wait(3000).then(() => setErrorMessage(''));
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <form onSubmit={submitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
