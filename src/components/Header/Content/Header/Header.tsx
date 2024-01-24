import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodosContext } from '../../../../Context/TodosContext';
import { Error } from '../../../../types/Error';

export const Header: React.FC = () => {
  const [message, setMessage] = useState('');
  const {
    handleErrorMessage,
    handleTodoAdd,
    isFieldDisabled,
    handleDisabled,
  } = useContext(TodosContext);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFieldDisabled) {
      titleField.current?.focus();
    }
  }, [titleField, isFieldDisabled]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFocus = () => {
    handleDisabled(false);
  };

  const handleKeyDown = async (event: React.FormEvent) => {
    event.preventDefault();

    handleDisabled(true);

    if (!message.trim()) {
      handleErrorMessage(Error.Empty);
      handleDisabled(false);
    }

    if (message.trim()) {
      await handleTodoAdd({
        title: message,
        userId: 12151,
        completed: false,
      });

      handleDisabled(false);

      setMessage('');

      titleField.current?.focus();
    }

    titleField.current?.focus();
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Active"
      />

      <form onSubmit={handleKeyDown}>
        <input
          ref={titleField}
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          value={message}
          placeholder="What needs to be done?"
          onChange={handleChange}
          onBlur={handleFocus}
          disabled={isFieldDisabled}
        />
      </form>
    </header>
  );
};
