import React, { RefObject } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  newTitle: string;
  setNewTitle: (title: string) => void;
  addNewTodo: () => void;
  tempTodo: Todo | null;
  inputRef: RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  addNewTodo,
  tempTodo,
  inputRef,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addNewTodo();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          name="todo"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={!!tempTodo}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
