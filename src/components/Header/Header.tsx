import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import * as errors from '../../Errors/Errors';
import { wait } from '../../utils/fetchClient';

interface Props {
  inputValue: string;
  setInputValue: (value: string) => void;
  setErrorMessage: (error: string) => void;
  createTodoHandler: (newTodo: Omit<Todo, 'id'>) => void;
}

export const Header: React.FC<Props> = ({
  inputValue,
  setInputValue,
  setErrorMessage,
  createTodoHandler,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (inputValue.trim().length > 0) {
      const newTodoTemplate = {
        userId: USER_ID,
        title: inputValue,
        completed: false,
      };

      createTodoHandler(newTodoTemplate);
    } else {
      setErrorMessage(errors.TITLE_EMPTY);

      wait(3000).then(() => setErrorMessage(''));
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={submitHandler}>
        <input
          ref={titleField}
          value={inputValue}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
