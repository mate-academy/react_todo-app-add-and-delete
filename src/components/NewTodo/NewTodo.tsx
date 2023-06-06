import React from 'react';

interface NewTodoProps {
  newTodo: string,
  inputDisabled: boolean,
  setNewTodo(event: React.ChangeEvent<HTMLInputElement>): void,
  onNewTodoSubmit(event: React.FormEvent<HTMLFormElement>): void,
}

export const NewTodo:React.FC<NewTodoProps> = ({
  newTodo,
  setNewTodo,
  inputDisabled,
  onNewTodoSubmit,
}) => {
  return (
    <form onSubmit={onNewTodoSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={setNewTodo}
        disabled={inputDisabled}
      />
    </form>
  );
};
