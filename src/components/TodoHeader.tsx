import React from 'react';

type Props = {
  newTodo: string;
  setNewTodo: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  setErrorMessage: (msg: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  newTodo,
  setNewTodo,
  onSubmit,
  isDisabled,
  inputRef,
  setErrorMessage,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          disabled={isDisabled}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => {
            setNewTodo(e.target.value);
            setErrorMessage('');
          }}
          autoFocus
        />
      </form>
    </header>
  );
};
