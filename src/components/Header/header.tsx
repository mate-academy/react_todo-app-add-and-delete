import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  userId: number;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  setTodos,
  setErrorMessage,
  setTempTodo,
  userId,
  setIsAdding,
  title,
  setTitle,
  isAdding,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmed,
      completed: false,
      userId,
    });

    setIsAdding(true);

    todoService
      .addPost({
        title: trimmed,
        completed: false,
        userId,
      })
      .then((newTodo: Todo) => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add todo');
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={inputRef}
          readOnly={isAdding}
        />
      </form>

      {/* Кнопка для toggle-all, для a11y */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle all todos"
        disabled={isAdding}
      />
    </header>
  );
};
