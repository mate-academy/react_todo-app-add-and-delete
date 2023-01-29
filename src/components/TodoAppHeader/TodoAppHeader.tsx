import React, { useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  addNewTodo: (title: string) => void;
  isAdding: boolean;
};

export const TodoAppHeader: React.FC<Props> = ({
  newTodoField,
  addNewTodo,
  isAdding,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleNewTodoFieldSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await addNewTodo(todoTitle.trim());
    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleNewTodoFieldSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
