import React, { RefObject } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleSubmit: (event: React.FormEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  titleNewTodo: string;
  loader: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  handleSubmit,
  inputRef,
  handleTitleChange,
  titleNewTodo,
  loader,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          onChange={handleTitleChange}
          value={titleNewTodo}
          readOnly={loader}
        />
      </form>
    </header>
  );
};
