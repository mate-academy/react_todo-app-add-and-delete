import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

type Props = {
  handleAddTodo: ({
    title,
    userId,
    completed,
  }: Omit<Todo, 'id'>) => Promise<void>;
  isSubmitting: boolean;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  todos,
  handleAddTodo,
  isSubmitting,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    const newTodo: Omit<Todo, 'id'> = {
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    return handleAddTodo(newTodo).then(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          autoFocus
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
