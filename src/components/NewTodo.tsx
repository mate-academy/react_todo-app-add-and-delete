import React, { useState, useEffect } from 'react';

interface NewTodoProps {
  focusedInput: React.RefObject<HTMLInputElement>;
  onAddTodo: (title: string) => Promise<void>;
  disabled?: boolean;
}

export const NewTodo: React.FC<NewTodoProps> = ({
  focusedInput,
  onAddTodo,
  disabled = false,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await onAddTodo(title);

      setTitle('');
    } catch {}
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    if (!disabled) {
      focusedInput.current?.focus();
    }
  }, [disabled]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleChange}
        ref={focusedInput}
        disabled={disabled}
      />
    </form>
  );
};
