import React from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>
  todoTitle: string;
  onChangeTodoTitle: (title: string) => void;
  submitNewTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
}

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  todoTitle,
  onChangeTodoTitle: onGetTodoTitle,
  submitNewTodo,
  isAdding,
}) => (
  <form onSubmit={submitNewTodo}>
    <input
      data-cy="NewTodoField"
      type="text"
      ref={newTodoField}
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={todoTitle}
      onChange={event => onGetTodoTitle(event.target.value)}
      disabled={isAdding}
    />
  </form>
);
