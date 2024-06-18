import React, { useEffect, useRef } from 'react';
import { TodoHeaderProps } from '../../types/ComponentsProps';

export const Header: React.FC<TodoHeaderProps> = ({
  inputValue,
  isEnabled,
  createTodo,
  setInputValue,
  toggleEnabled,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isEnabled]);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleCreateTodo = (
    keyEvent: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (keyEvent.key === 'Enter') {
      keyEvent.preventDefault();
      toggleEnabled(false);
      createTodo();
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChangeInput}
          onKeyDown={handleCreateTodo}
          value={inputValue}
          disabled={!isEnabled}
        />
      </form>
    </header>
  );
};
