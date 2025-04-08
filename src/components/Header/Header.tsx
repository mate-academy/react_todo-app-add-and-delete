import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

interface Props {
  handleAddTodo: (newTodo: Todo) => void;
  newTitle: string;
  setNewTitle: (newTitle: string) => void;
  loading: boolean;
}

export const Header: React.FC<Props> = ({
  handleAddTodo,
  newTitle,
  setNewTitle,
  loading,
}: Props) => {
  const createTodo = () => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTitle.trim(),
      completed: false,
    };

    handleAddTodo(newTodo);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [handleAddTodo]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          event.preventDefault();
          createTodo();
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event?.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
