import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  title: string
  setTitle: (newTitle: string) => void
  onSaveNewTodo: () => void,
  tempTodo: Todo | null,
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  onSaveNewTodo,
  tempTodo,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSaveNewTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
