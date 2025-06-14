import React, { useEffect, useRef } from 'react';

type TodoHeaderProps = {
  onAddTodo: (title: string) => Promise<void>;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  isAddingTodo: boolean;
  isDeletingAnyTodo: boolean;
};

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  onAddTodo,
  newTodoTitle,
  setNewTodoTitle,
  isAddingTodo,
  isDeletingAnyTodo,
}) => {
  const newFieldFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newFieldFocusRef.current?.focus();
  }, [isAddingTodo, isDeletingAnyTodo]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isAddingTodo || isAddingTodo || isDeletingAnyTodo) {
      return;
    }

    await onAddTodo(newTodoTitle);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isAddingTodo || isDeletingAnyTodo}
          ref={newFieldFocusRef}
        />
      </form>
    </header>
  );
};
