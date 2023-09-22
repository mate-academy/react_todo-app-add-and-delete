import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useTodos } from '../../TodosContext';
import { Errors } from '../../types/Errors';

export const Header: React.FC = () => {
  const {
    todos,
    addTodo,
    toggleAll,
    setErrorMessage,
    removeErrorIn3sec,
    title,
    setTitle,
    tempTodo,
    isSubmiting,
  } = useTodos();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, isSubmiting]);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Errors.emptyTitle);
      removeErrorIn3sec();

      return;
    }

    addTodo(title.trim());
  };

  const areAllTodosCompleated = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleated,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputRef}
          onChange={handleTitle}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
