import React, { useEffect, useRef, useState } from 'react';
import { useTodos } from '../utils/TodoContext';
import classNames from 'classnames';
import { Errors } from '../types/ErrorsTodo';
import { USER_ID } from '../api/todos';

export const Header: React.FC = () => {
  const { todos, addTodo, isLoading, setIsLoading, setErrorMessage } =
    useTodos();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputTodo, setInputTodo] = useState('');
  const allCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(Errors.NoErrors);
    setIsLoading(true);

    const trimmedInput = inputTodo.trim();

    try {
      if (!trimmedInput.length) {
        setErrorMessage(Errors.EmptyTitle);
        setTimeout(() => setErrorMessage(Errors.NoErrors), 3000);

        return;
      }

      await addTodo({
        id: Date.now(),
        title: trimmedInput,
        completed: false,
        userId: USER_ID,
      });

      setInputTodo('');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputTodo}
          onChange={event => setInputTodo(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
