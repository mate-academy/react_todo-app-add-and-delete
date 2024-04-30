import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/Context';
import cn from 'classnames';

export const Header: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    state: { todos },
    addTodo,
    setError,
    setTodos,
  } = useAppContext();

  const mainInputRef = useRef<HTMLInputElement>(null);

  const allCompleted = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = inputText.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    setIsSubmitting(true);
    addTodo(title)
      .then(() => setInputText(''))
      .catch(() => {
        setIsSubmitting(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleToggleAllClick = () => {
    if (allCompleted) {
      setTodos(
        todos.map(todo => ({
          ...todo,
          completed: false,
        })),
      );

      return;
    }

    setTodos(
      todos.map(todo => ({
        ...todo,
        completed: true,
      })),
    );
  };

  useEffect(() => {
    if (mainInputRef.current) {
      mainInputRef.current.focus();
    }
  }, [todos.length, isSubmitting]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={mainInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
