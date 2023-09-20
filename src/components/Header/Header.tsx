import React, { useState } from 'react';

interface Props {
  isUpdating: boolean
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Header: React.FC<Props> = ({ isUpdating, onSubmit }) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* these buttons are active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        id="button-togle"
        aria-label="Toogle All"
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInputChange}
          disabled={isUpdating}
        />
      </form>
    </header>
  );
};
