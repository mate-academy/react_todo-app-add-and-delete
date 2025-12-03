import React from 'react';

export interface TodoHeaderProps {
  allCompleted: boolean;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  isSubmitting: boolean;
  handleAddTodo: (e: React.FormEvent) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  allCompleted,
  newTitle,
  setNewTitle,
  isSubmitting,
  handleAddTodo,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder={allCompleted ? 'All done!' : 'What needs to be done?'}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
};
