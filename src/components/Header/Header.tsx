/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  newTodoTitle: string;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  postNewTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isTodoAdded: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoTitle, handleInput, postNewTodo, isTodoAdded,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={postNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInput}
          disabled={isTodoAdded}
        />
      </form>
    </header>
  );
};
