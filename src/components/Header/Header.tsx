import { useState } from 'react';

type HeaderProps = {
  addTodo: (newTitle: string) => void;
};

export const Header: React.FC<HeaderProps> = ({ addTodo }) => {
  const [newTitle, setNewTitle] = useState('');

  const clearForm = () => {
    setNewTitle('');
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle.trim()) {
      addTodo(newTitle);
    }

    clearForm();
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="toggle-all-active"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handleChangeTitle}
        />
      </form>
    </header>
  );
};
