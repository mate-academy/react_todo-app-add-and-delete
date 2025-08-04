import React from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  inputRef: React.LegacyRef<HTMLInputElement>;
  tempTodo: Todo | null;
  input: string;
  setInput: (input: string) => void;
  handleTodoSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  inputRef,
  tempTodo,
  input,
  setInput,
  handleTodoSubmit,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.every(todo => todo.completed && 'active')}`}
        data-cy="ToggleAllButton"
      />

      <form>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          disabled={tempTodo !== null}
          value={input}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyDown={e => {
            handleTodoSubmit(e);
          }}
          onChange={e => {
            setInput(e.target.value);
          }}
        />
      </form>
    </header>
  );
};
