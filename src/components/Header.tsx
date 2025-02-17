import React, { useContext, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { TodoContext } from '../services/TodoContext';

type Props = {};

export const Header: React.FC<Props> = () => {
  const { todos, updateTodo, addTodo, setErrorMessage } =
    useContext(TodoContext);
  const [title, setTitle] = useState('');
  const titleField = useRef<HTMLInputElement>(null);
  const [creating, setCreating] = useState(false);
  const [titleOnError, setTitleOnError] = useState('');
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  useEffect(() => {
    if (!creating) {
      titleField.current?.focus();
    }
  }, [creating]);

  const handleToggleTodos = () => {
    if (completedTodos.length === todos.length) {
      for (const todo of completedTodos) {
        updateTodo({ ...todo, completed: false });
      }

      return;
    }

    for (const todo of activeTodos) {
      updateTodo({ ...todo, completed: true });
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');
      return;
    }

    setTitleOnError(title);
    setTitle('');
    setCreating(true);
    addTodo(title)
      .then(() => {
        setTitleOnError('');
      })
      .catch(() => {
        setTitleOnError(title);
      })
      .finally(() => {
        setCreating(false);
        setTitle(titleOnError);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: completedTodos.length === todos.length,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={handleTitleChange}
          disabled={creating}
          ref={titleField}
        />
      </form>
    </header>
  );
};
