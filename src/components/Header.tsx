/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

interface Props {
  todos: Todo[],
  title: string,
  userId: number,
  isDisabledInput: boolean
  setTitle: (str: string) => void,
  handleAddTodo: (todo: Omit<Todo, 'id'>) => void
  setErrorMessage: (message: Errors | '') => void
}

export const Header: React.FC<Props> = ({
  todos,
  userId,
  title,
  setTitle,
  isDisabledInput,
  handleAddTodo,
  setErrorMessage,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current?.focus();
    }
  }, [isDisabledInput]);

  const handleSubmit = (e: React.FormEvent) => {
    const trimmedTitle = title.trim();

    e.preventDefault();

    if (trimmedTitle) {
      const newTodo: Omit<Todo, 'id'> = {
        title: trimmedTitle,
        userId,
        completed: false,
      };

      handleAddTodo(newTodo);
    } else {
      setErrorMessage(Errors.EmptyTitle);
    }
  };

  return (
    <header className="todoapp__header">
      {todos[0] && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          value={title}
          disabled={isDisabledInput}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
