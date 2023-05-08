/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, FormEvent } from 'react';

type Props = {
  newTodoTitle: string,
  setNewTodoTitle: (title: string) => void,
  addTodo: (event: FormEvent<HTMLFormElement>) => void,
  isLoading: boolean,
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  addTodo,
  isLoading,
}) => {
  const handleAddTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">

      <button type="button" className="todoapp__toggle-all active" />

      <form
        onSubmit={addTodo}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleAddTitle}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
