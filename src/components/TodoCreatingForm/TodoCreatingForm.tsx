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

  useEffect(() => {
    if (inputRef.current && !inputRef.current.disabled) {
      inputRef.current.focus();
    }
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTodoTitle(event.target.value);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      setErrorMessage(errorMessages.titleShouldNotBeEmpty);

      return;
    }

    try {
      createNewTodo(newTodoTitle.trim());
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
