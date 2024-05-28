import React, { useRef, useEffect, useState } from 'react';
import { USER_ID } from '../api/todos';
import { useTodos } from './TodoContext';
import { ErrorText } from '../types/ErrorText';
import classNames from 'classnames';

export const Header: React.FC = () => {
  const [inputTodo, setInputTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const { todos, addTodo, setErrMessage } = useTodos();
  const allCompleted = todos.every(el => el.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleAddTodo = async () => {
    const trimmedInput = inputTodo.trim();

    if (trimmedInput) {
      try {
        setLoading(true);
        await addTodo({
          id: Date.now(),
          title: trimmedInput,
          completed: false,
          userId: USER_ID,
        });
        setInputTodo('');
        setLoading(false);
      } catch (error) {
        setErrMessage(ErrorText.AddErr);
        setLoading(false);
      }
    } else {
      setErrMessage(ErrorText.EmptyTitleErr);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMessage(ErrorText.NoErr);
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
          disabled={loading}
        />
      </form>
    </header>
  );
};
