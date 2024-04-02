import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { useTodos } from '../TodosProvider';
import { errorMessages } from '../ErrorNotification';

export const TodoCreatingForm: React.FC = () => {
  const {
    newTodoTitle,
    setNewTodoTitle,
    createNewTodo,
    setErrorMessage,
    todos,
    isLoading,
  } = useTodos();

  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedTodo = newTodoTitle.trim();

  useEffect(() => {
    const currentInputRef = inputRef.current;

    if (currentInputRef && !currentInputRef.disabled) {
      currentInputRef.focus();
    }
  }, [inputRef, todos.length]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTodoTitle(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedTodo) {
      setErrorMessage(errorMessages.titleShouldNotBeEmpty);

      return;
    }

    try {
      createNewTodo(trimmedTodo);
    } catch (error) {
      setErrorMessage(errorMessages.unableToAddTodo);
    }
  };

  const allTodoComplited = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allTodoComplited })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit} autoFocus>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
