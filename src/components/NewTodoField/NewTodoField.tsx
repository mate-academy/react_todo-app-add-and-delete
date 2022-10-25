import React, { RefObject, useState } from 'react';

interface Props {
  newTodoField: RefObject<HTMLInputElement>;
  createTodo: (title: string) => void;
  isAdding: boolean;
}

export const NewTodoField: React.FC<Props> = ({
  newTodoField, createTodo, isAdding,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        createTodo(newTodoTitle);
        setNewTodoTitle('');
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        disabled={isAdding}
        onChange={(event) => setNewTodoTitle(event.target.value)}
      />
    </form>
  );
};
