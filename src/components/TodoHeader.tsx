import React, { ChangeEvent, FormEvent, RefObject } from 'react';

interface PropsTodoHeader {
  newTodoTitle: string;
  isAdding: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onNewTodoTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const TodoHeader: React.FC<PropsTodoHeader> = ({
  newTodoTitle,
  isAdding,
  inputRef,
  onNewTodoTitleChange,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={onNewTodoTitleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
