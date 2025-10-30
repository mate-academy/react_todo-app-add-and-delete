import React, { useState } from 'react';

interface NewTodoProps {
  focusedInput: React.Ref<HTMLInputElement>;
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

    if (disabled) {
      return;
    }

    await onAddTodo(title);
    setTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

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
