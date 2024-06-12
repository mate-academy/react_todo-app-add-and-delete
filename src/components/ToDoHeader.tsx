import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
type Props = {
  addTodos: (event: React.FormEvent) => Promise<void> | undefined;
  toggleButton: () => void;
  todos: Todo[];
  allTodosAreCompleted: boolean;
  toDoTitle: string;
  setToDoTitle: (toDoTitle: string) => void;
};
export const TodoHeader = ({
  addTodos,
  toggleButton,
  allTodosAreCompleted,
  toDoTitle,
  setToDoTitle,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allTodosAreCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={() => toggleButton()}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={addTodos}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={toDoTitle}
          onChange={event => setToDoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
