import React from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { useTodoContext } from '../../context/TodoContext';

export const TodoForm = React.memo(() => {
  const {
    inputRef,
    addTodo,
    changeErrorMessage,
    tempTodo,
  } = useTodoContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputRef.current && inputRef.current.value) {
      addTodo(inputRef.current.value);
    } else {
      changeErrorMessage(ErrorMessages.EMPTY);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={!!tempTodo}
        ref={inputRef}
      />
    </form>
  );
});
