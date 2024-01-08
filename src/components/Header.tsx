/* eslint-disable no-console */
import React, { useEffect, useRef } from 'react';
import { postTodo } from '../api/todos';
import { Todo, ErrorType } from '../types';

const USER_ID = 12139;

type Props = {
  addTodo: (todo: Todo) => void
  handleError: (error: ErrorType) => void
};

export const Header: React.FC<Props> = ({ addTodo, handleError }) => {
  const inputRef = useRef<any>();
  const formRef = useRef<any>();

  useEffect(() => {
    formRef.current.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
    });

    inputRef.current.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key !== 'Enter') {
        return;
      }

      if (inputRef.current.value.trim() === '') {
        handleError(ErrorType.ADD);

        return;
      }

      postTodo({
        id: 0,
        userId: USER_ID,
        title: inputRef.current.value.trim(),
        completed: false,
      }).then(addTodo);

      inputRef.current.value = '';
    });
  }, []);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="text"
      />

      {/* Add a todo on form submit */}
      <form ref={formRef}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
