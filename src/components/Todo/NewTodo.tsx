import { useTodoApi, useTodoNewTodoInput, useTodoTodos } from './Context';
import React, { useEffect, useRef } from 'react';

export const NewTodo: React.FC = () => {
  const { handleTodoAdd, handleNewTodoInputChange } = useTodoApi();
  const { tempTodo } = useTodoTodos();
  const newTodoInput = useTodoNewTodoInput();
  const inputReference = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleNewTodoInputChange(event.currentTarget.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    handleTodoAdd(newTodoInput);
  };

  useEffect(() => {
    inputReference.current?.focus();
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoInput}
        onChange={handleChange}
        disabled={!!tempTodo}
        ref={inputReference}
      />
    </form>
  );
};
