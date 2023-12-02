import React, { RefObject } from 'react';

interface TodoHeaderProps {
  isSubmitting: boolean;
  todoInput: string;
  setTodoInput: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: (event: React.FormEvent) => void;
  focusRef: RefObject<HTMLInputElement>;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  isSubmitting,
  todoInput,
  setTodoInput,
  handleAddTodo,
  focusRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle all todos"
      />
      <form onSubmit={handleAddTodo}>
        <input
          disabled={isSubmitting}
          ref={focusRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
        />
      </form>
    </header>
  );
};
