import React from 'react';

type HeaderInputProps = {
  addNewTodo: (title: string) => void;
  title: string;
  setTitle: (value: string) => void;
  disabled: boolean;
};

export const HeaderInput = ({
  addNewTodo,
  title,
  setTitle,
  disabled,
}: HeaderInputProps) => {
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNewTodo(title);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={submitForm}>
        <input
          disabled={disabled}
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => {
            setTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
