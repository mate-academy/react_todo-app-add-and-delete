import React from 'react';

interface TodoFormProps {
  newTodoTitle: string;
  isSubmitting: boolean;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
  setNewTodoTitle: (title: string) => void;
  handleAddTodo: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  newTodoTitle,
  isSubmitting,
  newTodoInputRef,
  setNewTodoTitle,
  handleAddTodo,
}) => {
  return (
    <form onSubmit={handleAddTodo}>
      <input
        ref={newTodoInputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={e => setNewTodoTitle(e.target.value)}
        disabled={isSubmitting}
      />
    </form>
  );
};
