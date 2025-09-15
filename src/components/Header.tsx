import React from 'react';
import { useState } from 'react';

type Props = {
  onAdd: (title: string) => void;
  allCompleted: boolean;
};

export const Header: React.FC<Props> = ({ onAdd, allCompleted }) => {
  const [value, setValue] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      return;
    }

    onAdd(value.trim());
    setValue('');
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={e => setValue(e.target.value)}
          // onFocus={() => true}
        />
      </form>
    </header>
  );
};
