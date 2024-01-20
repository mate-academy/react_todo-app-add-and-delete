import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodosContext } from '../../../../Context/TodosContext';
import { Error } from '../../../../types/Error';

export const Header: React.FC = () => {
  const [message, setMessage] = useState('');
  const [hasFocus, setHasFocus] = useState(true);
  const { handleErrorMessage, handleTodo, tempTodo } = useContext(TodosContext);
  const titleField = useRef<HTMLInputElement>(null);
  let isDisabled = false;

  if (tempTodo === null) {
    isDisabled = false;
  } else {
    isDisabled = true;
  }

  useEffect(() => {
    if (hasFocus) {
      titleField.current?.focus();
    }

    // eslint-disable-next-line no-console
    console.log(hasFocus);
  }, [hasFocus]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFocus = () => {
    setHasFocus(false);
  };

  const handleKeyDown = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!message.trim()) {
      handleErrorMessage(Error.Empty);
    }

    if (message.trim()) {
      await handleTodo({
        title: message,
        userId: 12151,
        completed: false,
      });

      setMessage('');
    }

    // eslint-disable-next-line no-console
    console.log(titleField);

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

      {/* Add a todo on form submit */}
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
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
