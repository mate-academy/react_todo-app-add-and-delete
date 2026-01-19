import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onAddTodo: (title: string, onSuccess?: () => void) => void;
  todos: Todo[];
  isLoadingTodos: boolean;
};
export const TodoHeader: React.FC<Props> = ({
  onAddTodo,
  todos,
  isLoadingTodos,
}) => {
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setTitle(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTodo(title, () => setTitle(''));
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!isLoadingTodos) {
      inputRef.current?.focus();
    }
  }, [isLoadingTodos]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputRef}
          onChange={handleTitleChange}
          disabled={isLoadingTodos}
        />
      </form>
    </header>
  );
};
