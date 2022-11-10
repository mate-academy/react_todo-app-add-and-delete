/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  onInput: (input: string) => void;
  addTodo: (event: React.FormEvent) => Promise<void>;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  newTodoTitle,
  onInput,
  addTodo,
  isAdding,
}) => (
  <header className="todoapp__header">
    <button
      data-cy="ToggleAllButton"
      type="button"
      className="todoapp__toggle-all active"
    />

    <form
      onSubmit={addTodo}
    >
      <input
        disabled={isAdding}
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        value={newTodoTitle}
        onChange={(event) => onInput(event.target.value)}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  </header>
);
