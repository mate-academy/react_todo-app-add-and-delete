import React from 'react';

interface TodoHeaderProps {
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({
  newTitle,
  setNewTitle,
  addTodo,
  isInputDisabled,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          ref={inputRef}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};

export default TodoHeader;
