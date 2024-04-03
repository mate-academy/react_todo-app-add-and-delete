import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTodos } from '../utils/TodoContext';
import { USER_ID } from '../api/todos';
import { ErrText } from '../types/ErrText';

export const Header: React.FC = () => {
  const [inputTodo, setInputTodo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { todos, addTodo, setErrMessage, loading, setLoading } = useTodos();
  const allCompleted = todos.every(el => el.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, submitting, addTodo]);

  const handleAddTodo = () => {
    const trimmedInput = inputTodo.trim();

    if (trimmedInput) {
      setSubmitting(true);
      addTodo({
        id: Date.now(),
        title: trimmedInput,
        completed: false,
        userId: USER_ID,
      });
      setInputTodo('');
      setSubmitting(false);
    } else if (!trimmedInput.length) {
      setErrMessage(ErrText.EmptyErr);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrMessage(ErrText.NoErr);
    handleAddTodo();
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
          onChange={e => setInputTodo(e.target.value)}
          disabled={submitting || loading}
        />
      </form>
    </header>
  );
};
