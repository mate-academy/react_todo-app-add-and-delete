/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';

interface Props {
  userId: number,
  inputText: string;
  setInputText: (str: string) => void;
  setError: (message: Errors | '') => void;
  handleAdd: (todo: Omit<Todo, 'id'>) => void;
}

export const Header: React.FC<Props> = ({
  userId,
  inputText,
  setInputText,
  setError,
  handleAdd,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const title = inputText.trim();

    if (title) {
      const newTodo = {
        title: inputText,
        userId,
        completed: false,
      };

      handleAdd(newTodo);
    } else {
      setError(Errors.EmptyTitle);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </form>
    </header>
  );
};
