import React from 'react';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  newTodo: string;
  setNewTodo: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isSubmiting: boolean;
};

export const AddTodo: React.FC<Props> = ({
  inputRef,
  newTodo,
  setNewTodo,
  handleSubmit,
  isSubmiting,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={event => setNewTodo(event.target.value)}
        disabled={isSubmiting}
      />
    </form>
  );
};
