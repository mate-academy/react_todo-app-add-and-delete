import React, { FormEvent, useState } from 'react';

type Props = {
  onAddNewTodo: (newTodoTitle: string) => Promise<void>,
};

export const Header:React.FC<Props> = ({ onAddNewTodo }) => {
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setDisabled(true);
      await onAddNewTodo(title);
    } finally {
      setTitle('');
      setDisabled(false);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        aria-label="toggle"
        type="button"
        className="todoapp__toggle-all active"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
