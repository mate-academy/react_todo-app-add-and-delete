import React, { FormEvent } from 'react';

type Props = {
  field: React.RefObject<HTMLInputElement>;
  title: string;
  addTodo: (value: string) => void;
  onChange: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  field,
  title,
  addTodo,
  onChange,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(title);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={field}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => onChange(e.target.value)}
        />
      </form>
    </header>
  );
};
