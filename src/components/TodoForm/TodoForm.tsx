import React from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>;
  todoTitle: string;
  setTodoTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addTodo: () => void;
  isAdding: boolean;
}

export const TodoForm: React.FC <Props> = ({
  newTodoField,
  todoTitle,
  setTodoTitle,
  addTodo,
  isAdding,
}) => {
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isAdding}
        value={todoTitle}
        onChange={setTodoTitle}
      />
    </form>
  );
};
