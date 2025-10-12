import React from 'react';

type Props = {
  title: string;
  isLoading: boolean;
  isAdding: boolean;
  allCompleted: boolean;
  onAdd: (e: React.FormEvent) => void;
  onChangeTitle: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader: React.FC<Props> = ({
  title,
  isLoading,
  isAdding,
  allCompleted,
  onAdd,
  onChangeTitle,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        disabled={isAdding}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onAdd}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => onChangeTitle(e.target.value)}
          disabled={isLoading || isAdding}
          autoFocus
          ref={inputRef}
        />
      </form>
    </header>
  );
};
