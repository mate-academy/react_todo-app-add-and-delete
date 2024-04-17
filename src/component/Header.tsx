import React, { useEffect, useRef, useState } from 'react';
import { useTodos } from '../utils/TodoContext';
import classNames from 'classnames';
import { Errors } from '../types/ErrorsTodo';
import { USER_ID } from '../api/todos';

export const Header: React.FC = () => {
  const { todos, addTodo, loading, setLoading, setErrorMessage } = useTodos();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputTodo, setInputTodo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const allCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addTodo, loading, submitting]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(Errors.NoErrors);
    setLoading(true);
    setSubmitting(true);

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
      setSubmitting(false);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      setSubmitting(false);
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
          disabled={submitting || loading}
        />
      </form>
    </header>
  );
};
