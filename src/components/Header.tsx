import React from 'react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onCreateTodo: (value: string) => Promise<void>;
  triggerFocus: number;
};

export const Header: React.FC<Props> = ({ onCreateTodo, triggerFocus }) => {
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();

    setDisabled(true);
    onCreateTodo(title)
      .then(() => {
        setTitle('');
      })
      .catch(() => {})
      .finally(() => {
        setDisabled(false);
      });
  };

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [disabled, triggerFocus]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all the todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleOnSubmitForm}>
        <input
          ref={inputRef}
          disabled={disabled}
          onChange={event => {
            setTitle(event.target.value);
          }}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
        />
      </form>
    </header>
  );
};
