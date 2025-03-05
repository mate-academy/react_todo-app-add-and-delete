import React, { Dispatch, SetStateAction } from 'react';

interface HeaderProps {
  handleForm: (event: React.FormEvent) => void;
  errorGetTodos: () => void;
  setCreateNewTodos: Dispatch<SetStateAction<string>>;
  createNewTodos: string;
  inputRef: React.RefObject<HTMLInputElement>;
  loadingNewItem: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  handleForm,
  errorGetTodos,
  setCreateNewTodos,
  createNewTodos,
  inputRef,
  loadingNewItem,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have active class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          handleForm(event);
          errorGetTodos();
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={createNewTodos}
          onChange={event => {
            setCreateNewTodos(event.target.value);
          }}
          ref={inputRef}
          autoFocus
          disabled={loadingNewItem}
        />
      </form>
    </header>
  );
};
